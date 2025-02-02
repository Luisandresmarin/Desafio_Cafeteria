const express = require('express');
const app = express();
const cafes = require("./cafes.json");

app.use(express.json());

app.get("/cafes", (req, res) => {
    res.status(200).json(cafes);
});

app.delete("/cafes/:id", (req, res) => {
    const jwt = req.header("Authorization");
    if (jwt) {
        const { id } = req.params;
        const cafeIndexFound = cafes.findIndex(c => c.id == id);
    if (cafeIndexFound >= 0) {
            cafes.splice(cafeIndexFound, 1);
            res.send(cafes);
        } else {
            res.status(404).send({ message: "No se encontró ningún cafe con ese id" }); 
        }
    }
});

app.post("/cafes", (req, res) => {
    const cafe = req.body;
    const { id } = cafe;
    const existeUncafeConEseId = cafes.some(c => c.id == id);
    if (existeUncafeConEseId) res.status(400).send({ message: "Ya existe un café con ese ID" });
    else {
        cafes.push(cafe);
        res.status(201).send(cafes);
    }
});

app.put("/cafes/:id", (req, res) => {
    const cafe = req.body;
    const { id } = req.params;
    if (id != cafe.id) return res.status(400).send({ message: "El ID de la URL no coincide con el ID del café recibido" });

    const cafeIndexFound = cafes.findIndex(c => c.id == id);
    if (cafeIndexFound >= 0) {
        cafes[cafeIndexFound] = cafe;
        res.send(cafes);
    } else {
        res.status(404).send({ message: "No se encontró ningún café con ese id" });
    }
});

app.delete("/cafes/:id", (req, res) => {
    const jwt = req.header("Authorization");

    if (!jwt) {
        return res.status(400).send({ message: "No recibió ningún token en las cabeceras" });
    }

    const { id } = req.params;
    const cafeIndexFound = cafes.findIndex(c => c.id == id);

    if (cafeIndexFound === -1) {
        console.log(`⚠️  Café con ID ${id} no encontrado, devolviendo 404`);
        return res.status(404).send({ message: "No se encontró ningún café con ese id" });
    }

    cafes.splice(cafeIndexFound, 1);
    console.log(`✅ Café con ID ${id} eliminado`);
    res.send(cafes);
});


app.use("*", (req, res) => {
    res.status(404).send({ message: "La ruta que intenta consultar no existe" });
});


if (require.main === module) {
    app.listen(3000, () => {
        console.log("Servidor ON en el puerto 3000");
    });
}

module.exports = app;
