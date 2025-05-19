package com.example.favoritesservice.integration;

import com.example.favoritesservice.model.Favorite;
import com.example.favoritesservice.repository.FavoriteRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.springframework.test.web.servlet.MockMvc;

import static org.junit.jupiter.api.Assertions.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@AutoConfigureMockMvc
class FavoritesIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private FavoriteRepository favoriteRepository;

    @Autowired
    private ObjectMapper objectMapper;

    private String userId;
    private String productId;
    private Favorite testFavorite;

    @DynamicPropertySource
    static void setProperties(DynamicPropertyRegistry registry) {
        registry.add("spring.data.mongodb.uri", () -> "mongodb://localhost:27017/favoritesdb");
        registry.add("spring.data.mongodb.auto-index-creation", () -> true);
        registry.add("spring.redis.host", () -> "localhost");
        registry.add("spring.redis.port", () -> 6379);
    }

    @BeforeEach
    void setUp() {
        favoriteRepository.deleteAll();
        userId = "testUser123";
        productId = "testProduct456";
        testFavorite = new Favorite(userId, productId);
    }

    @Test
    void addFavorite_ShouldCreateNewFavorite() throws Exception {
        mockMvc.perform(post("/api/favorites/{userId}/product/{productId}", userId, productId)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.userId").value(userId))
                .andExpect(jsonPath("$.productId").value(productId))
                .andExpect(jsonPath("$.id").exists());

        assertTrue(favoriteRepository.existsByUserIdAndProductId(userId, productId));
    }

    @Test
    void addFavorite_WhenExists_ShouldReturnConflict() throws Exception {
        favoriteRepository.save(testFavorite);

        mockMvc.perform(post("/api/favorites/{userId}/product/{productId}", userId, productId)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isConflict());
    }

    @Test
    void getUserFavorites_ShouldReturnFavorites() throws Exception {
        favoriteRepository.save(testFavorite);

        mockMvc.perform(get("/api/favorites/{userId}", userId)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].userId").value(userId))
                .andExpect(jsonPath("$[0].productId").value(productId))
                .andExpect(jsonPath("$[0].id").exists());
    }

    @Test
    void getUserFavorites_WhenNoFavorites_ShouldReturnEmptyList() throws Exception {
        mockMvc.perform(get("/api/favorites/{userId}", userId)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$").isEmpty());
    }

    @Test
    void removeFavorite_ShouldDeleteFavorite() throws Exception {
        favoriteRepository.save(testFavorite);

        mockMvc.perform(delete("/api/favorites/{userId}/product/{productId}", userId, productId))
                .andExpect(status().isNoContent());

        assertFalse(favoriteRepository.existsByUserIdAndProductId(userId, productId));
    }

    @Test
    void removeFavorite_WhenNotExists_ShouldReturnNoContent() throws Exception {
        mockMvc.perform(delete("/api/favorites/{userId}/product/{productId}", userId, productId))
                .andExpect(status().isNoContent());
    }

    @Test
    void isFavorite_ShouldReturnTrue_WhenFavoriteExists() throws Exception {
        favoriteRepository.save(testFavorite);

        mockMvc.perform(get("/api/favorites/{userId}/product/{productId}", userId, productId)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(content().string("true"));
    }

    @Test
    void isFavorite_ShouldReturnFalse_WhenFavoriteDoesNotExist() throws Exception {
        mockMvc.perform(get("/api/favorites/{userId}/product/{productId}", userId, productId)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(content().string("false"));
    }

    @Test
    void checkFavorite_ShouldReturnTrue_WhenFavoriteExists() throws Exception {
        favoriteRepository.save(testFavorite);

        mockMvc.perform(get("/api/favorites/{userId}/product/{productId}/check", userId, productId)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(content().string("true"));
    }

    @Test
    void checkFavorite_ShouldReturnFalse_WhenFavoriteDoesNotExist() throws Exception {
        mockMvc.perform(get("/api/favorites/{userId}/product/{productId}/check", userId, productId)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(content().string("false"));
    }
}
