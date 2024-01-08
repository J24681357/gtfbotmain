{ pkgs }: {
	deps = [
		pkgs.python310
  pkgs.lsof
  pkgs.toybox
  pkgs.nodejs-16_x
        pkgs.nodePackages.typescript-language-server
        pkgs.yarn
        pkgs.replitPackages.jest
	];
}