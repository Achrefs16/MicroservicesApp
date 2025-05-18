package com.example.favoritesservice.controller;

import com.example.favoritesservice.model.Favorite;
import com.example.favoritesservice.service.FavoritesService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/favorites")
@RequiredArgsConstructor
@Tag(name = "Favorites", description = "Favorites management APIs")
public class FavoritesController {
    private final FavoritesService favoritesService;

    @GetMapping("/{userId}")
    @Operation(summary = "Get user favorites", description = "Retrieve all favorites for a specific user")
    public List<Favorite> getUserFavorites(@PathVariable String userId) {
        return favoritesService.getUserFavorites(userId);
    }

    @PostMapping("/{userId}/product/{productId}")
    @Operation(summary = "Add favorite", description = "Add a product to user's favorites")
    public ResponseEntity<Favorite> addFavorite(
            @PathVariable String userId,
            @PathVariable String productId) {
        return ResponseEntity.ok(favoritesService.addFavorite(userId, productId));
    }

    @DeleteMapping("/{userId}/product/{productId}")
    @Operation(summary = "Remove favorite", description = "Remove a product from user's favorites")
    public ResponseEntity<Void> removeFavorite(
            @PathVariable String userId,
            @PathVariable String productId) {
        favoritesService.removeFavorite(userId, productId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{userId}/product/{productId}")
    @Operation(summary = "Check favorite", description = "Check if a product is in user's favorites")
    public ResponseEntity<Boolean> isFavorite(
            @PathVariable String userId,
            @PathVariable String productId) {
        return ResponseEntity.ok(favoritesService.isFavorite(userId, productId));
    }

    @GetMapping("/{userId}/product/{productId}/check")
    @Operation(summary = "Check favorite status", description = "Check if a product is in user's favorites")
    public ResponseEntity<Boolean> checkFavorite(
            @PathVariable String userId,
            @PathVariable String productId) {
        return ResponseEntity.ok(favoritesService.isFavorite(userId, productId));
    }
} 