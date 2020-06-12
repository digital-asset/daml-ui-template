build:
	daml build
	daml codegen js -o daml.js .daml/dist/*.dar
	cd ui && yarn install --force --frozen-lockfile
	cd ui && yarn build
	
deploy: build
	mkdir -p deploy
	cp .daml/dist/*.dar deploy
	cd ui && zip -r ../deploy/daml-ui-template.zip build

clean:
	rm -rf .daml
	rm -rf daml.js
	rm -rf ui/node_modules
      rm -rf ui/build
      rm -rf deploy
