import cors from "cors"
import { app } from "./app"

const port = process.env.SERVER_PORT || 3000

app.use(cors())
app.listen(port, () => console.log(`Server is running on port ${port}`))
