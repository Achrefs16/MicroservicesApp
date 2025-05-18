package com.example.favoritesservice.service;

import com.example.favoritesservice.model.Favorite;
import com.example.favoritesservice.repository.FavoriteRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import java.util.List;

@Service
@RequiredArgsConstructor
public class FavoritesService {
    private final FavoriteRepository favoriteRepository;

    @Cacheable(value = "userFavorites", key = "#userId")
    public List<Favorite> getUserFavorites(String userId) {
        return favoriteRepository.findByUserId(userId);
    }

    @CacheEvict(value = {"userFavorites", "favoriteItem", "favoriteStatus"}, allEntries = true)
    public Favorite addFavorite(String userId, String productId) {
        if (favoriteRepository.existsByUserIdAndProductId(userId, productId)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Favorite already exists");
        }
        Favorite favorite = new Favorite(userId, productId);
        return favoriteRepository.save(favorite);
    }

    @CacheEvict(value = {"userFavorites", "favoriteItem", "favoriteStatus"}, allEntries = true)
    public void removeFavorite(String userId, String productId) {
        favoriteRepository.deleteByUserIdAndProductId(userId, productId);
    }

    @Cacheable(value = "favoriteStatus", key = "#userId + '-' + #productId")
    public boolean isFavorite(String userId, String productId) {
        return favoriteRepository.existsByUserIdAndProductId(userId, productId);
    }
} 