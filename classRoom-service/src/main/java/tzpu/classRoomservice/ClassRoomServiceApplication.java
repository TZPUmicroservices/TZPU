package tzpu.classRoomservice;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.reactive.function.client.WebClient;

@SpringBootApplication
public class ClassRoomServiceApplication {
	@Bean
	public WebClient.Builder getWebClientBuilder()
	{
		return WebClient.builder();
	}

	@Bean
	public RestTemplate getRestTemplate() {
		return new RestTemplate();
	}

	public static void main(String[] args) {
		SpringApplication.run(ClassRoomServiceApplication.class, args);
	}


}
