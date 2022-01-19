let dP;
window.addEventListener('beforeinstallprompt', (e) => {
	e.preventDefault();
	dP = e;
	showInstallPromotion();
});
