build:
	vsce package
clean:
	rm *.vsix
install:
	npm install
install-env:
	npm install vsce
update-env:
	npm install -g vsce