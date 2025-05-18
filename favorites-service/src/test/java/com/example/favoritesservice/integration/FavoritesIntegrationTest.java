package com.example.favoritesservice.integration;

import com.example.favoritesservice.model.Favorite;
import com.example.favoritesservice.repository.FavoriteRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.springframework.test.web.servlet.MockMvc;
import org.testcontainers.containers.GenericContainer;
import org.testcontainers.containers.MongoDBContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;
import org.testcontainers.utility.DockerImageName;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@Testcontainers
class FavoritesIntegrationTest {

    @Container
    static MongoDBContainer mongoDBContainer = new MongoDBContainer("mongo:6.0.2");

    @Container
    static GenericContainer<?> redisContainer = new GenericContainer<>(DockerImageName.parse("redis:7.2.3"))
            .withExposedPorts(6379);

    @DynamicPropertySource
    static void setProperties(DynamicPropertyRegistry registry) {
        registry.add("spring.data.mongodb.uri", mongoDBContainer::getReplicaSetUrl);
        registry.add("spring.redis.host", redisContainer::getHost);
        registry.add("spring.redis.port", () -> redisContainer.getMappedPort(6379));
    }

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private FavoriteRepository favoriteRepository;

    private String userId;
    private String productId;

    @BeforeEach
    void setUp() {
        favoriteRepository.deleteAll();
        userId = "user123";
        productId = "product456";
    }

    @Test
    void addFavorite_ShouldCreateNewFavorite() throws Exception {
        mockMvc.perform(post("/api/favorites/{userId}/product/{productId}", userId, productId)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.userId").value(userId))
                .andExpect(jsonPath("$.productId").value(productId));

        assertTrue(favoriteRepository.existsByUserIdAndProductId(userId, productId));
    }

    @Test
    void addFavorite_WhenExists_ShouldReturnConflict() throws Exception {
        // Add a favorite first
        Favorite favorite = new Favorite(userId, productId);
        favoriteRepository.save(favorite);

        mockMvc.perform(post("/api/favorites/{userId}/product/{productId}", userId, productId)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isConflict());
    }

    @Test
    void getUserFavorites_ShouldReturnFavorites() throws Exception {
        // Add a favorite first
        Favorite favorite = new Favorite(userId, productId);
        favoriteRepository.save(favorite);

        mockMvc.perform(get("/api/favorites/{userId}", userId))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].userId").value(userId))
                .andExpect(jsonPath("$[0].productId").value(productId));
    }

    @Test
    void getUserFavorites_WhenNoFavorites_ShouldReturnEmptyList() throws Exception {
        mockMvc.perform(get("/api/favorites/{userId}", userId))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$").isEmpty());
    }

    @Test
    void removeFavorite_ShouldDeleteFavorite() throws Exception {
        // Add a favorite first
        Favorite favorite = new Favorite(userId, productId);
        favoriteRepository.save(favorite);

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
    void isFavorite_WhenExists_ShouldReturnTrue() throws Exception {
        // Add a favorite first
        Favorite favorite = new Favorite(userId, productId);
        favoriteRepository.save(favorite);

        mockMvc.perform(get("/api/favorites/{userId}/product/{productId}/check", userId, productId))
                .andExpect(status().isOk())
                .andExpect(content().string("true"));
    }

    @Test
    void isFavorite_WhenNotExists_ShouldReturnFalse() throws Exception {
        mockMvc.perform(get("/api/favorites/{userId}/product/{productId}/check", userId, productId))
                .andExpect(status().isOk())
                .andExpect(content().string("false"));
    }
}