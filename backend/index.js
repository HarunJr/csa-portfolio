import express, { json } from 'express';
import { PrismaClient } from '@prisma/client';
// import cors from 'cors';

const prisma = new PrismaClient();
const app = express();

app.use(json());

//cors
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

// Create minted data
app.post('/mints', async (req, res) => {
    try {
        const mints = await prisma.mintData.create({
            data: {
                tokenName: req.body.tokenName,
                policyId: req.body.policyId,
                mintingPolicy: req.body.mintingPolicy,
                scriptAddress: req.body.scriptAddress
            },
        });
        res.status(201).json({mints});
    } catch (error) {
        if (error instanceof Error) {
            res.status(500).json({message: error.message})
        } else {
            res.status(500).json({message: 'An unknown error occurred'})
        }    }
});

// get all mint data
app.get('/mints', async (req, res) => {
    try {
        const mints = await prisma.mintData.findMany();
        res.status(200).json({mints});
    } catch (error) {
        if (error instanceof Error) {
            res.status(500).json({message: error.message})
        } else {
            res.status(500).json({message: 'An unknown error occurred'})
        }
    }
});

// Delete Mint Data
app.delete('/mints/:id', async (req, res) => {
    try {
        const mints = await prisma.mintData.delete({
            where: {
                id: Number(req.params.id),
            },
        });
        res.status(200).json({mints});
    } catch (error) {
        if (error instanceof Error) {
            res.status(500).json({message: error.message})
        } else {
            res.status(500).json({message: 'An unknown error occurred'})
        }    }
});



app.get('/test', (req, res) => {
    try {
        res.status(200).json({message: 'API is working'})
    } catch (error) {
        if (error instanceof Error) {
            res.status(500).json({message: error.message})
        } else {
            res.status(500).json({message: 'An unknown error occurred'})
        }    }
});

// get all users
app.get('/users', async (req, res) => {
    try {
        const users = await prisma.user.findMany()
        res.status(200).json({users});
    } catch (error) {
        if (error instanceof Error) {
            res.status(500).json({message: error.message})
        } else {
            res.status(500).json({message: 'An unknown error occurred'})
        }    }
});

// get user by id
app.get('/users/:id', async (req, res) => {
    try {
        const users = await prisma.user.findUnique({
            where: {
                id: Number(req.params.id),
            }
        });
        res.status(200).json({users});
    } catch (error) {
        if (error instanceof Error) {
            res.status(500).json({message: error.message})
        } else {
            res.status(500).json({message: 'An unknown error occurred'})
        }    }
});

// Create User
app.post('/users', async (req, res) => {
    try {
        const users = await prisma.user.create({
            data: {
                name: req.body.name,
                email: req.body.email
            },
        });
        res.status(201).json({users});
    } catch (error) {
        if (error instanceof Error) {
            res.status(500).json({message: error.message})
        } else {
            res.status(500).json({message: 'An unknown error occurred'})
        }    }
});

// Update User
app.put('/users/:id', async (req, res) => {
    try {
        const users = await prisma.user.update({
            where: {
                id: Number(req.params.id),
            },
            data: {
                name: req.body.name,
                email: req.body.email
            }
        });
        res.status(200).json({users});
    } catch (error) {
        if (error instanceof Error) {
            res.status(500).json({message: error.message})
        } else {
            res.status(500).json({message: 'An unknown error occurred'})
        }    }
});

// Delete User
app.delete('/users/:id', async (req, res) => {
    try {
        const users = await prisma.user.delete({
            where: {
                id: Number(req.params.id),
            },
        });
        res.status(200).json({users});
    } catch (error) {
        if (error instanceof Error) {
            res.status(500).json({message: error.message})
        } else {
            res.status(500).json({message: 'An unknown error occurred'})
        }    }
});

// app.get("/api/home", (req: Request, res) => {
//     res.json({ message: "Like this video!", people: ["Arpan", "Jack", "Barry"] });
// });

// start server

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});