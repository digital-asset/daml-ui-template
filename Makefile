build:
	daml build
	daml codegen js -o daml.js .daml/dist/*.dar
	cd ui && yarn build
	cd operator_bot && poetry build

deploy: build
	mkdir -p deploy
	cp .daml/dist/*.dar deploy
	cd ui && zip -r ../deploy/daml-ui-template.zip build
	cd operator_bot && cp dist/bot-1.0.0.tar.gz ../deploy/daml-ui-template-bot.tar.gz

start_bot:
	cd operator_bot && (DAML_LEDGER_URL=localhost:6865 poetry run python bot/operator_bot.py)

clean:
	rm -rf .daml
	rm -rf daml.js
	rm -rf ui/node_modules
	rm -rf ui/build
	rm -rf operator_bot/build
	rm -rf deploy
