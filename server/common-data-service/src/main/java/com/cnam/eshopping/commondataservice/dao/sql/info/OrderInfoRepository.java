package com.cnam.eshopping.commondataservice.dao.sql.info;

import com.cnam.eshopping.commondataservice.entity.sql.info.OrderInfo;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrderInfoRepository extends JpaRepository<OrderInfo, Integer> {
}
