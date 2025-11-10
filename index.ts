import { Server } from 'socket.io'
import http from 'http'
import type { BusLocation } from './types'

const server = http.createServer()
const io = new Server(server, {
  cors: { origin: '*' }
})

const lastLatLngs: Record<BusLocation['id'], { x: number, y: number }> = {}

io.on('connection', (socket) => {
  const { role, busId } = socket.handshake.query
  console.log(`Cliente conectado ${socket.id} como ${role}${busId ? ' con busId ' + busId : ''}`)

  // Guardar info en el socket
  socket.data.role = role as string
  if (busId) socket.data.busId = busId as string

  socket.on('bus-location', (data: BusLocation) => {
    lastLatLngs[data.id] = data.position
    console.log('save position', data.position)

    socket.broadcast.emit('bus-location', {
        ...data,
        type: 'WS_TYPE_BUS_POSITION'
    })
  })

  socket.on('request-last-position', (id: string) => {
    console.log('req last pos', id, lastLatLngs[id])
    console.log('lastLatLngs', lastLatLngs)

    socket.emit('response-last-position', { id, latlng: lastLatLngs[id] })
  })

  socket.on('disconnect', () => {
    console.log(`Cliente desconectado ${socket.id}`)
  })
})

const PORT = process.env.PORT || 8080
server.listen(PORT, () => console.log(`Servidor Socket.IO escuchando en http://localhost:${PORT}`))
