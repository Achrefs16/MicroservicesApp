package com.example.favoritesservice.controller;

import com.example.favoritesservice.model.Favorite;
import com.example.favoritesservice.service.FavoritesService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class FavoritesControllerTest {

    @Mock
    private FavoritesService favoritesService;

    @InjectMocks
    private FavoritesController favoritesController;

    private String userId;
    private String productId;
    private Favorite favorite;

    @BeforeEach
    void setUp() {
        userId = "testUser123";
        productId = "testProduct456";
        favorite = new Favorite(userId, productId);
    }

    @Test
    void getUserFavorites_ShouldReturnFavoritesList() {
        List<Favorite> expectedFavorites = Arrays.asList(favorite);
        when(favoritesService.getUserFavorites(userId)).thenReturn(expectedFavorites);

        List<Favorite> result = favoritesController.getUserFavorites(userId);

        assertEquals(expectedFavorites, result);
        verify(favoritesService).getUserFavorites(userId);
    }

    @Test
    void addFavorite_ShouldReturnCreatedFavorite() {
        when(favoritesService.addFavorite(userId, productId)).thenReturn(favorite);

        ResponseEntity<Favorite> response = favoritesController.addFavorite(userId, productId);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(favorite, response.getBody());
        verify(favoritesService).addFavorite(userId, productId);
    }

    @Test
    void removeFavorite_ShouldReturnNoContent() {
        doNothing().when(favoritesService).removeFavorite(userId, productId);

        ResponseEntity<Void> response = favoritesController.removeFavorite(userId, productId);

        assertEquals(HttpStatus.NO_CONTENT, response.getStatusCode());
        verify(favoritesService).removeFavorite(userId, productId);
    }

    @Test
    void isFavorite_ShouldReturnTrue_WhenFavoriteExists() {
        when(favoritesService.isFavorite(userId, productId)).thenReturn(true);

        ResponseEntity<Boolean> response = favoritesController.isFavorite(userId, productId);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertTrue(response.getBody());
        verify(favoritesService).isFavorite(userId, productId);
    }

    @Test
    void checkFavorite_ShouldReturnFalse_WhenFavoriteDoesNotExist() {
        when(favoritesService.isFavorite(userId, productId)).thenReturn(false);

        ResponseEntity<Boolean> response = favoritesController.checkFavorite(userId, productId);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertFalse(response.getBody());
        verify(favoritesService).isFavorite(userId, productId);
    }
} 