const mongoose = require("mongoose")
const Document = require("./Document")
const dotenv = require("dotenv")
dotenv.config({ path: "config.env" })

mongoose.connect(process.env.MONGODB_CONNECTION_STRING, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true,
})

// const io = require("socket.io")(3001, {
//   cors: {
//     origin: "http://localhost:3000",
//     methods: ["GET", "POST"],
//   },
// })
const express = require("express")
const app = express()
const server = require('http').Server(app)
const io = require('socket.io')(server, {
    cors: {
      methods: ["GET", "POST"],
    }
    })

const path = require("path")
app.use(express.static(path.join(__dirname, "client", "build")))
const defaultValue = ""

io.on("connection", socket => {
  socket.on("get-document", async documentId => {
    const document = await findOrCreateDocument(documentId)
    socket.join(documentId)
    socket.emit("load-document", document.data)

    socket.on("send-changes", delta => {
      socket.broadcast.to(documentId).emit("receive-changes", delta)
    })

    socket.on("save-document", async data => {
      await Document.findByIdAndUpdate(documentId, { data })
    })
  })
})

async function findOrCreateDocument(id) {
  if (id == null) return

  const document = await Document.findById(id)
  if (document) return document
  return await Document.create({ _id: id, data: defaultValue })
}
const PORT = process.env.PORT || 443
if(process.env.NODE_ENV === 'production'){
    app.use(express.static('client/build'))
}
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "client", "build", "index.html"));
});
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})