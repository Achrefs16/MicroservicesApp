package middleware

import (
	"os"
	"strings"

	"github.com/dgrijalva/jwt-go"
	"github.com/gofiber/fiber/v2"
)

// JWTAuthentication middleware to verify the JWT token and protect routes
func JWTAuthentication(c *fiber.Ctx) error {
	tokenString := c.Get("Authorization") // Get token from Authorization header

	// Remove "Bearer " prefix
	tokenString = strings.TrimPrefix(tokenString, "Bearer ")

	// Parse the token
	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		// Ensure token is signed with the correct algorithm
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fiber.NewError(fiber.StatusUnauthorized, "Invalid token")
		}
		return []byte(os.Getenv("JWT_SECRET")), nil
	})

	if err != nil {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"error": "Invalid token",
		})
	}

	// Extract the claims
	if claims, ok := token.Claims.(jwt.MapClaims); ok && token.Valid {
		// Attach user details to the context
		c.Locals("userId", claims["userId"])
		c.Locals("role", claims["role"])
		return c.Next() // Proceed to the next handler
	} else {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"error": "Unauthorized",
		})
	}
}

// AdminRoleMiddleware ensures only users with an 'admin' role can access the route
func AdminRoleMiddleware(c *fiber.Ctx) error {
	role := c.Locals("role").(string)
	if role != "admin" {
		return c.Status(fiber.StatusForbidden).JSON(fiber.Map{
			"error": "Forbidden: Admin access required",
		})
	}
	return c.Next() // Allow access to the route
}

// ClientRoleMiddleware ensures only users with a 'client' role can access the route
func ClientRoleMiddleware(c *fiber.Ctx) error {
	role := c.Locals("role").(string)
	if role != "client" {
		return c.Status(fiber.StatusForbidden).JSON(fiber.Map{
			"error": "Forbidden: Client access required",
		})
	}
	return c.Next() // Allow access to the route
}
