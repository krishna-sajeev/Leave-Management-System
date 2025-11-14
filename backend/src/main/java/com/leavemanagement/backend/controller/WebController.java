package com.leavemanagement.backend.controller;


import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class WebController {

    @RequestMapping(value = "/{path:[^\\.]*}")
    public String forwardReactRoutes() {
        return "forward:/index.html";
    }
}

