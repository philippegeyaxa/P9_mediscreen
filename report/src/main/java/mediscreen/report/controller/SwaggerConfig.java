package mediscreen.report.controller;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import springfox.documentation.builders.PathSelectors;
import springfox.documentation.builders.RequestHandlerSelectors;
import springfox.documentation.service.ApiInfo;
import springfox.documentation.service.Contact;
import springfox.documentation.spi.DocumentationType;
import springfox.documentation.spring.web.plugins.Docket;

import java.util.Collections;

@Configuration
public class SwaggerConfig {

    @Bean
    public Docket api() {

        ApiInfo info = new ApiInfo(
                "Report",
                "Module for medical reports generation written during project 9 of the AXA software academy.",
                "1.0.0",
                null,
                null,
                null,
                null,
                Collections.emptyList()
        );

        return new Docket(DocumentationType.SWAGGER_2)
                .apiInfo(info)
                .select()
                .apis(RequestHandlerSelectors.basePackage("mediscreen.report.controller"))
                .paths(PathSelectors.any())
                .build();
    }
}
