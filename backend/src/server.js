import express from "express";
import cors from "cors";
import "dotenv/config";
import { createClient } from "@supabase/supabase-js";

// Admin client (secret key): sirf backend mein
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SECRET_KEY
);
// Login ke liye alag client (publishable key)
const authClient = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_PUBLISHABLE_KEY
);

const app = express();
app.use(cors());
app.use(express.json());

// ---------- AUTH MIDDLEWARE ----------
async function requireAuth(req, res, next) {
  const token = req.headers.authorization?.replace("Bearer ", "");
  if (!token) return res.status(401).json({ error: "Login required" });
  const { data, error } = await supabase.auth.getUser(token);
  if (error || !data.user)
    return res.status(401).json({ error: "Invalid or expired token" });
  req.user = data.user;
  next();
}

// ---------- PRODUCTS ----------
app.get("/api/products", async (req, res) => {
  let query = supabase.from("products").select("*").order("id");
  if (req.query.category) query = query.eq("category", req.query.category);
  const { data, error } = await query;
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

app.get("/api/products/:id", async (req, res) => {
  const { data, error } = await supabase
    .from("products").select("*").eq("id", req.params.id).single();
  if (error) return res.status(404).json({ error: "Product not found" });
  res.json(data);
});

// ---------- SIGNUP / LOGIN ----------
app.post("/api/auth/signup", async (req, res) => {
  const { full_name, email, password } = req.body;
  if (!full_name || !email || !password)
    return res.status(400).json({ error: "Name, email aur password zaroori hain" });
  if (password.length < 6)
    return res.status(400).json({ error: "Password kam az kam 6 characters ka ho" });

  const { error } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { full_name },
  });
  if (error) return res.status(400).json({ error: error.message });

  const { data, error: loginError } = await authClient.auth.signInWithPassword({
    email, password,
  });
  if (loginError) return res.status(400).json({ error: loginError.message });
  res.json({ token: data.session.access_token, user: { id: data.user.id, email, full_name } });
});

app.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body;
  const { data, error } = await authClient.auth.signInWithPassword({ email, password });
  if (error) return res.status(401).json({ error: "Email ya password galat hai" });
  res.json({
    token: data.session.access_token,
    user: {
      id: data.user.id,
      email: data.user.email,
      full_name: data.user.user_metadata?.full_name,
    },
  });
});

// ---------- CART ----------
app.get("/api/cart", requireAuth, async (req, res) => {
  const { data, error } = await supabase
    .from("cart_items")
    .select("id, product_id, size, quantity, products(name, image_url, new_price)")
    .eq("user_id", req.user.id)
    .order("created_at");
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// Add to cart (quantity 1 barhata hai)
app.post("/api/cart/add", requireAuth, async (req, res) => {
  const { product_id, size = "M" } = req.body;
  if (!product_id) return res.status(400).json({ error: "product_id zaroori hai" });

  const { data: existing } = await supabase
    .from("cart_items").select("id, quantity")
    .eq("user_id", req.user.id).eq("product_id", product_id).eq("size", size)
    .maybeSingle();

  if (existing) {
    await supabase.from("cart_items")
      .update({ quantity: existing.quantity + 1 }).eq("id", existing.id);
  } else {
    const { error } = await supabase.from("cart_items")
      .insert({ user_id: req.user.id, product_id, size, quantity: 1 });
    if (error) return res.status(400).json({ error: error.message });
  }
  res.json({ message: "Cart mein add ho gaya" });
});

// Remove (quantity 1 kam karta hai, 0 hone par item hat jata hai)
app.post("/api/cart/remove", requireAuth, async (req, res) => {
  const { product_id, size = "M" } = req.body;
  const { data: existing } = await supabase
    .from("cart_items").select("id, quantity")
    .eq("user_id", req.user.id).eq("product_id", product_id).eq("size", size)
    .maybeSingle();
  if (!existing) return res.status(404).json({ error: "Item cart mein nahi hai" });

  if (existing.quantity > 1) {
    await supabase.from("cart_items")
      .update({ quantity: existing.quantity - 1 }).eq("id", existing.id);
  } else {
    await supabase.from("cart_items").delete().eq("id", existing.id);
  }
  res.json({ message: "Cart update ho gaya" });
});

// ---------- ORDERS ----------
app.post("/api/orders", requireAuth, async (req, res) => {
  const { shipping_name, shipping_phone, shipping_address, shipping_city } = req.body;
  if (!shipping_name || !shipping_phone || !shipping_address || !shipping_city)
    return res.status(400).json({ error: "Shipping ki poori details dein" });

  const { data: cart, error: cartError } = await supabase
    .from("cart_items")
    .select("product_id, size, quantity, products(name, new_price, stock)")
    .eq("user_id", req.user.id);
  if (cartError) return res.status(500).json({ error: cartError.message });
  if (!cart.length) return res.status(400).json({ error: "Cart khali hai" });

  for (const item of cart) {
    if (item.products.stock < item.quantity)
      return res.status(400).json({ error: `${item.products.name} ka stock kam hai` });
  }

  // Total backend khud nikalta hai (frontend par bharosa nahi)
  const total = cart.reduce((sum, i) => sum + i.products.new_price * i.quantity, 0);

  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert({
      user_id: req.user.id, total,
      shipping_name, shipping_phone, shipping_address, shipping_city,
    })
    .select().single();
  if (orderError) return res.status(500).json({ error: orderError.message });

  const items = cart.map((i) => ({
    order_id: order.id,
    product_id: i.product_id,
    product_name: i.products.name,
    size: i.size,
    quantity: i.quantity,
    price: i.products.new_price,
  }));
  const { error: itemsError } = await supabase.from("order_items").insert(items);
  if (itemsError) return res.status(500).json({ error: itemsError.message });

  for (const i of cart) {
    await supabase.from("products")
      .update({ stock: i.products.stock - i.quantity }).eq("id", i.product_id);
  }
  await supabase.from("cart_items").delete().eq("user_id", req.user.id);

  res.json({ message: "Order place ho gaya", order_id: order.id, total });
});

app.get("/api/orders", requireAuth, async (req, res) => {
  const { data, error } = await supabase
    .from("orders").select("*, order_items(*)")
    .eq("user_id", req.user.id)
    .order("created_at", { ascending: false });
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// ---------- NEWSLETTER ----------
app.post("/api/newsletter", async (req, res) => {
  const { email } = req.body;
  if (!email || !email.includes("@"))
    return res.status(400).json({ error: "Sahi email dein" });
  const { error } = await supabase.from("newsletter_subscribers").insert({ email });
  if (error?.code === "23505") return res.json({ message: "Aap pehle se subscribed hain" });
  if (error) return res.status(500).json({ error: error.message });
  res.json({ message: "Subscribe ho gaye" });
});

app.listen(process.env.PORT, () =>
  console.log(`Server running on http://localhost:${process.env.PORT}`)
);