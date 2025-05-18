package com.example.favoritesservice.service;

import com.example.favoritesservice.model.Favorite;
import com.example.favoritesservice.repository.FavoriteRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class FavoritesServiceTest {

    @Mock
    private FavoriteRepository favoriteRepository;

    @InjectMocks
    private FavoritesService favoritesService;

    private String userId;
    private String productId;
    private Favorite favorite;

    @BeforeEach
    void setUp() {
        userId = "user123";
        productId = "product456";
        favorite = new Favorite(userId, productId);
    }

    @Test
    void getUserFavorites_ShouldReturnListOfFavorites() {
        List<Favorite> expectedFavorites = Arrays.asList(favorite);
        when(favoriteRepository.findByUserId(userId)).thenReturn(expectedFavorites);

        List<Favorite> result = favoritesService.getUserFavorites(userId);

        assertEquals(expectedFavorites, result);
        verify(favoriteRepository).findByUserId(userId);
    }

    @Test
    void addFavorite_WhenNotExists_ShouldAddFavorite() {
        when(favoriteRepository.existsByUserIdAndProductId(userId, productId)).thenReturn(false);
        when(favoriteRepository.save(any(Favorite.class))).thenReturn(favorite);

        Favorite result = favoritesService.addFavorite(userId, productId);

        assertNotNull(result);
        assertEquals(userId, result.getUserId());
        assertEquals(productId, result.getProductId());
        verify(favoriteRepository).save(any(Favorite.class));
    }

    @Test
    void addFavorite_WhenExists_ShouldThrowException() {
        when(favoriteRepository.existsByUserIdAndProductId(userId, productId)).thenReturn(true);

        assertThrows(RuntimeException.class, () -> favoritesService.addFavorite(userId, productId));
        verify(favoriteRepository, never()).save(any(Favorite.class));
    }

    @Test
    void removeFavorite_ShouldDeleteFavorite() {
        doNothing().when(favoriteRepository).deleteByUserIdAndProductId(userId, productId);

        assertDoesNotThrow(() -> favoritesService.removeFavorite(userId, productId));
        verify(favoriteRepository).deleteByUserIdAndProductId(userId, productId);
    }

    @Test
    void isFavorite_WhenExists_ShouldReturnTrue() {
        when(favoriteRepository.existsByUserIdAndProductId(userId, productId)).thenReturn(true);

        boolean result = favoritesService.isFavorite(userId, productId);

        assertTrue(result);
        verify(favoriteRepository).existsByUserIdAndProductId(userId, productId);
    }

    @Test
    void isFavorite_WhenNotExists_ShouldReturnFalse() {
        when(favoriteRepository.existsByUserIdAndProductId(userId, productId)).thenReturn(false);

        boolean result = favoritesService.isFavorite(userId, productId);

        assertFalse(result);
        verify(favoriteRepository).existsByUserIdAndProductId(userId, productId);
    }
} 