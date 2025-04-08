# Start from the latest golang base image
FROM golang:1.21

# Set the Current Working Directory inside the container
WORKDIR /app

# Copy go mod and sum files
COPY go.mod ./
COPY go.sum ./
RUN go mod download

# Copy the source code
COPY . .

# Build the Go app
RUN go build -o main .

# Expose port (adjust as needed)
EXPOSE 4000

# Command to run the executable
CMD ["./main"]
