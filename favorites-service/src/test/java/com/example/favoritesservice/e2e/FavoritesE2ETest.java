package com.example.favoritesservice.e2e;

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
class FavoritesE2ETest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private FavoriteRepository favoriteRepository;

    @Autowired
    private ObjectMapper objectMapper;

    private String userId;
    private String productId1;
    private String productId2;

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
        productId1 = "testProduct456";
        productId2 = "testProduct789";
    }

    @Test
    void completeFavoriteFlow_ShouldWorkCorrectly() throws Exception {
        // Step 1: Check initial state - no favorites
        mockMvc.perform(get("/api/favorites/{userId}", userId)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$").isEmpty());

        // Step 2: Add first favorite
        mockMvc.perform(post("/api/favorites/{userId}/product/{productId}", userId, productId1)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.userId").value(userId))
                .andExpect(jsonPath("$.productId").value(productId1))
                .andExpect(jsonPath("$.id").exists());

        // Step 3: Verify first favorite was added
        mockMvc.perform(get("/api/favorites/{userId}", userId)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].userId").value(userId))
                .andExpect(jsonPath("$[0].productId").value(productId1));

        // Step 4: Check favorite status
        mockMvc.perform(get("/api/favorites/{userId}/product/{productId}", userId, productId1)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(content().string("true"));

        // Step 5: Add second favorite
        mockMvc.perform(post("/api/favorites/{userId}/product/{productId}", userId, productId2)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.userId").value(userId))
                .andExpect(jsonPath("$.productId").value(productId2))
                .andExpect(jsonPath("$.id").exists());

        // Step 6: Verify both favorites are present
        mockMvc.perform(get("/api/favorites/{userId}", userId)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$[0].userId").value(userId))
                .andExpect(jsonPath("$[1].userId").value(userId));

        // Step 7: Try to add duplicate favorite
        mockMvc.perform(post("/api/favorites/{userId}/product/{productId}", userId, productId1)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isConflict());

        // Step 8: Remove first favorite
        mockMvc.perform(delete("/api/favorites/{userId}/product/{productId}", userId, productId1))
                .andExpect(status().isNoContent());

        // Step 9: Verify first favorite was removed
        mockMvc.perform(get("/api/favorites/{userId}/product/{productId}", userId, productId1)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(content().string("false"));

        // Step 10: Verify only second favorite remains
        mockMvc.perform(get("/api/favorites/{userId}", userId)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$[0].productId").value(productId2));

        // Step 11: Remove second favorite
        mockMvc.perform(delete("/api/favorites/{userId}/product/{productId}", userId, productId2))
                .andExpect(status().isNoContent());

        // Step 12: Verify no favorites remain
        mockMvc.perform(get("/api/favorites/{userId}", userId)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$").isEmpty());
    }
} 