package com.cnam.eshopping.authenticationservice.model;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class AuthenticationRequest {

    private String username;
    private String password;
}
