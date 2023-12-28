start:
	@echo "Building latest docker image...."

	docker build . -t frajdi/nasa-project
	
	@echo "Runing docker container with terminal..."
	
	@echo -e "\033[92mLocalhost Website\033[0m"
	@echo -e "\033[94mhttp://localhost:8000\033[0m"

	docker run -it -p 8000:8000 frajdi/nasa-project


docker push: 
	@echo pushing frajdi/nasa-project to docker hub.
	docker push frajdi/nasa-project
	

