package com.cnam.eshopping.commondataservice.service.interfaces;

import com.cnam.eshopping.commondataservice.dto.ProductInfoDTO;
import com.cnam.eshopping.commondataservice.entity.sql.info.ProductInfo;
import com.cnam.eshopping.commondataservice.model.FilterAttributesResponse;
import com.cnam.eshopping.commondataservice.model.HomeTabsDataResponse;
import com.cnam.eshopping.commondataservice.model.MainScreenResponse;
import com.cnam.eshopping.commondataservice.model.SearchSuggestionResponse;

import java.util.HashMap;
import java.util.List;

public interface CommonDataService {

    MainScreenResponse getHomeScreenData(String apiName);

    FilterAttributesResponse getFilterAttributesByProducts(String queryParams);

    ProductInfoDTO getProductsByCategories(String queryParams);

    HashMap<Integer, ProductInfo> getProductsById(String queryParams);

    HomeTabsDataResponse getBrandsAndApparelsByGender(String apiName);

    SearchSuggestionResponse getSearchSuggestionList();
}

