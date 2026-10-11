const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.json());
app.use(express.static(path.join(__dirname, "..", "frontend")));

const services = [
  { id: 1, name: "Classic Haircut", price: 150, duration: "30 min", icon: "✂️" },
  { id: 2, name: "Hair Styling", price: 250, duration: "45 min", icon: "💈" },
  { id: 3, name: "Beard Trim", price: 100, duration: "20 min", icon: "🧔" },
  { id: 4, name: "Hair Spa", price: 500, duration: "60 min", icon: "🧖" },
  { id: 5, name: "Facial", price: 400, duration: "45 min", icon: "✨" },
  { id: 6, name: "Hair Color", price: 700, duration: "60 min", icon: "🎨" }
];

// In-memory storage for this student demo: bookings reset when the server restarts.
let appointments = [];
let nextId = 1;

app.get("/api/health", (req, res) => res.json({ status: "ok", app: "Street Barber Salon Management System" }));
app.get("/api/services", (req, res) => res.json(services));
app.get("/api/appointments", (req, res) => res.json(appointments));

app.post("/api/appointments", (req, res) => {
  const { customerName, phone, serviceId, date, time } = req.body || {};
  if (!customerName || !phone || !serviceId || !date || !time) {
    return res.status(400).json({ error: "Please fill in every field before booking." });
  }
  const service = services.find(item => item.id === Number(serviceId));
  if (!service) return res.status(400).json({ error: "Please choose a valid salon service." });
  if (!/^[0-9+() -]{7,20}$/.test(phone.trim())) {
    return res.status(400).json({ error: "Please enter a valid phone number." });
  }
  const appointment = {
    id: nextId++,
    customerName: customerName.trim(),
    phone: phone.trim(),
    serviceId: service.id,
    serviceName: service.name,
    price: service.price,
    date,
    time
  };
  appointments.push(appointment);
  res.status(201).json({ message: "Booking confirmed successfully!", appointment });
});

app.delete("/api/appointments/:id", (req, res) => {
  const id = Number(req.params.id);
  const existing = appointments.some(item => item.id === id);
  if (!existing) return res.status(404).json({ error: "Appointment not found." });
  appointments = appointments.filter(item => item.id !== id);
  res.json({ message: "Appointment deleted successfully." });
});

app.get("*", (req, res) => res.sendFile(path.join(__dirname, "..", "frontend", "index.html")));

app.listen(PORT, () => {
  console.log(`Street Barber Salon running at http://localhost:${PORT}`);
});
