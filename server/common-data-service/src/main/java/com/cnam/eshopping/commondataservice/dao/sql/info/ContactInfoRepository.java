package com.cnam.eshopping.commondataservice.dao.sql.info;

import com.cnam.eshopping.commondataservice.entity.sql.info.ContactInfo;
import org.springframework.data.jpa.repository.JpaRepository;


public interface ContactInfoRepository extends JpaRepository<ContactInfo, Integer> {
}
