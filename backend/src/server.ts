import app from "./app"
import { config } from "./config/config"
import Database from "./config/database"
import PDFService from "./services/pdfService"

const startServer = async (): Promise<void> => {
  try {
    // Connect to database
    await Database.connect()

    // Start server
    const server = app.listen(config.server.port, () => {
      console.log(`🚀 Server running on port ${config.server.port}`)
      console.log(`📝 Environment: ${config.server.env}`)
      console.log(`🌐 Frontend URL: ${config.server.frontendUrl}`)
    })

    // Graceful shutdown
    const gracefulShutdown = async (signal: string) => {
      console.log(`\n${signal} received. Starting graceful shutdown...`)

      server.close(async () => {
        console.log("HTTP server closed")

        try {
          await Database.disconnect()
          await PDFService.closeBrowser()
          console.log("✅ Graceful shutdown completed")
          process.exit(0)
        } catch (error) {
          console.error("❌ Error during shutdown:", error)
          process.exit(1)
        }
      })

      // Force close after 10 seconds
      setTimeout(() => {
        console.error("❌ Forced shutdown after timeout")
        process.exit(1)
      }, 10000)
    }

    // Handle shutdown signals
    process.on("SIGTERM", () => gracefulShutdown("SIGTERM"))
    process.on("SIGINT", () => gracefulShutdown("SIGINT"))

    // Handle uncaught exceptions
    process.on("uncaughtException", (error) => {
      console.error("❌ Uncaught Exception:", error)
      gracefulShutdown("UNCAUGHT_EXCEPTION")
    })

    process.on("unhandledRejection", (reason, promise) => {
      console.error("❌ Unhandled Rejection at:", promise, "reason:", reason)
      gracefulShutdown("UNHANDLED_REJECTION")
    })
  } catch (error) {
    console.error("❌ Failed to start server:", error)
    process.exit(1)
  }
}

// Start the server
startServer()
