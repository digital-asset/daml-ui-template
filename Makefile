build:
	daml build
	daml codegen js -o daml.js .daml/dist/*.dar
	cd ui && yarn install --force --frozen-lockfile

clean:
	rm -rf .daml
	rm -rf daml.js
	rm -rf ui/node_modules
	rm -rf ui/build
