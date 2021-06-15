document.addEventListener('DOMContentLoaded', function(){

	const isRTL = $('html').attr('dir') == 'rtl';
	const isMobile = $(window).width() < 992;

	if (isRTL) {
		$('.wpcf7').attr('dir','rtl');
	} else{
		$('.wpcf7').attr('dir','ltr');
	}

	function is_touch_device() {
		try {
			document.createEvent("TouchEvent");
			return true;
		} catch (e) {
			return false;
		}
	}

	if(is_touch_device()){
		$('body').addClass('touch');
	} else{
		$('body').addClass('no-touch');
	}

	// Sliders
	function equalSlideHeight(slider){
		$(slider).on('setPosition', function () {
			$(this).find('.slick-slide').height('auto');
			var slickTrack = $(this).find('.slick-track');
			var slickTrackHeight = $(slickTrack).height();
			$(this).find('.slick-slide').css('height', slickTrackHeight + 'px');
		});
	}

	let arrowsButtons = {
		prevArrow: '<button type="button" class="slick-prev" aria-label="Previous"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 14.8 25.7"><path d="M2.8 2.8l10 10-10 10" stroke-linecap="round" stroke-linejoin="round" stroke-width="4"/></svg></button>',
		nextArrow: '<button type="button" class="slick-next" aria-label="Next"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 14.8 25.7"><path d="M12 2.8l-10 10 10 10" stroke-linecap="round" stroke-linejoin="round" stroke-width="4"/></svg></button>'
	}

	$('.products-slider-wrapper').each(function(i, cmp){
		$(cmp).find('.products-slider').slick({
			slidesToShow: 4,
			slidesToScroll: 4,
			infinite: true,
			arrows: true,
			dots: false,
			speed: 800,
			rtl: isRTL,
			...arrowsButtons
		});
	});

	$('.quality-slider-component').each(function(i, cmp){
		const slider = $(cmp).find('.quality-slider');
		const arm = $(cmp).find('.arm');

		slider.on('init reInit', function(){
			$(cmp).find('.nav-btn').eq(0).addClass('active');
			$(arm).css({
				top: 18 + 33.333 * 0 + '%'
			});
		});

		slider.on('beforeChange', function (event, slick, currentSlide, nextSlide) {
			$(cmp).find('.nav-btn[data-slide="'+nextSlide+'"]').addClass('active').siblings().removeClass('active');

			$(arm).css({
				top: 18 + 33.333 * (nextSlide % 3) + '%'
			});
		});

		slider.slick({
			slidesToShow: 1,
			slidesToScroll: 1,
			infinite: true,
			arrows: false,
			dots: false,
			speed: 600,
			rtl: isRTL
		});

		equalSlideHeight(slider);

		$(cmp).find('.nav-btn').click(function(e){
			e.preventDefault();

			slider.slick('slickGoTo', $(this).data('slide') );

			$(this).addClass('active').siblings().removeClass('active');
		});
	});

	$('.product-card').each(function(i, el){
		const btn = $(el).find('.card-link');

		$(btn).click(function(e){

			const params = {
				image: $(el).data('image'),
				name: $(el).data('name'),
				sku: $(el).data('sku')
			}

			e.preventDefault();
			showProductModal(params);
		});
	});

	function showProductModal(params){
		const productModalCard = $('#js-product-modal-card');

		productModalCard.find('#js-product-image').attr('src', params.image);
		productModalCard.find('#js-product-caption').text(params.name);
		productModalCard.find('#js-product-sku').text(params.sku);

		productModalCard.find('#js-product-name-field').val(params.name)
		productModalCard.find('#js-product-sku-field').val(params.sku)

		showModal('#product-modal');
	}

	// Header
	$('[data-goto-screen]').click(function(e){
		let screenIndex = $(this).data('goto-screen');

		goToScreen(screenIndex - 1);
	});

	// Scroll behaviors
	let currentScreen = 0;
	const bgVideos = document.querySelectorAll('#page-video-bg video');
	const bgVideo = document.querySelector('#page-video-bg video#straight');
	const bgVideoReverse = document.querySelector('#page-video-bg video#reverse');
	const sections = document.querySelectorAll('.fullscreen-section');
	let isScrolling = false;

	!!bgVideo && bgVideo.pause();

	function goToScreen(next){
		if (next < 0) return false;
		if (next >= sections.length) return false;
		if (isScrolling) return false;

		$('.top-nav [data-goto-screen="'+(next+1)+'"]').parent().addClass('active').siblings().removeClass('active')

		let direction = next > currentScreen ? 'down' : 'up';
		// let diff = Math.abs(next - currentScreen);

		// bgVideo.playbackRate = diff;
		// bgVideoReverse.playbackRate = diff;

		currentScreen = next;

		if (next == 2) {
			setTimeout(function(){
				$('.quality-section .arm').addClass('active');
			}, 1000);
		} else{
			setTimeout(function(){
				$('.quality-section .arm').removeClass('active');
			}, 1000);
		}

		$('.fullscreen-section').eq(next).addClass('active').siblings().removeClass('active');

		let isPlaying = false;
		let isPlayingReverse = false;

		// Scroll to section
		$('.page-content').css({
			transform: `translateY(${ (next / sections.length) * -100 }%)`
		});

		isScrolling = true;

		setTimeout(function(){
			isScrolling = false;
		}, 1500);

		// Work with video
		let nextPoint = +sections[next].dataset.point;

		if (!nextPoint) {
			nextPoint = next / sections.length;
		}

		if (direction == 'down') {
			let videoListener = bgVideo.addEventListener('timeupdate', function(e){
				if (bgVideo.paused) return false;

				let currentPosition = bgVideo.currentTime / bgVideo.duration;
				bgVideoReverse.currentTime = bgVideo.duration - bgVideo.currentTime;

				bgVideo.classList.remove('hidden');
				bgVideoReverse.classList.add('hidden');

				if (currentPosition >= nextPoint) {
					isPlaying && bgVideo.pause();
					isPlaying = false;

					console.log('down - paused');

					removeEventListener('timeupdate', videoListener);
				}
			});

			bgVideo.play();
			isPlaying = true;
		}

		if (direction == 'up') {
			let videoListener = bgVideoReverse.addEventListener('timeupdate', function(e){
				if (bgVideoReverse.paused) return false;

				let currentPosition = bgVideoReverse.currentTime / bgVideoReverse.duration;
				bgVideo.currentTime = bgVideoReverse.duration - bgVideoReverse.currentTime;

				bgVideoReverse.classList.remove('hidden');
				bgVideo.classList.add('hidden');

				console.log((1 - nextPoint), currentPosition);

				if (currentPosition >= (1 - nextPoint) - 0.03) {
					isPlayingReverse && bgVideoReverse.pause();
					isPlayingReverse = false;

					console.log('up - paused');

					removeEventListener('timeupdate', videoListener);
				}
			});

			bgVideoReverse.play();
			isPlayingReverse = true;
		}
	}

	$('body').bind('mousewheel', function(e){
		if ($(this).hasClass('modal-visible')) return false;

		if(e.originalEvent.wheelDelta / 120 > 0) {
			// Scroll Up
			goToScreen(currentScreen - 1);
		}
		else{
			// Scroll Down
			goToScreen(currentScreen + 1);
		}
	});

	// Scroll to anchor
	$(document).on('click', 'a[href^="#"]', function (event) {
		event.preventDefault();

		if ($.attr(this, 'href') === '#') {
			return false;
		}

		let offset = 0;

		$('html, body').animate({
			scrollTop: $($.attr(this, 'href')).offset().top - offset
		}, 500);
	});

	// Menu opener
	$('.menu-opener').click(function(e){
		e.preventDefault();

		$('.menu-opener').toggleClass('active');
		$('.mobile-top-nav').toggleClass('opened');
		$('.header').toggleClass('nav-opened');
	});

	// Sticky Header
	function stickyHeader(){
		let header = document.querySelector('.header');

		if (!!header) {
			window.scrollY > 100
				? header.classList.add('sticky')
				: header.classList.remove('sticky');
		};
	}


	window.addEventListener('scroll', stickyHeader);
	setTimeout(stickyHeader, 100);

	// Modals
	$('.modal').css('display','block');

	$('.modal-dialog').click(e => e.stopPropagation());
	$('.modal').click(function(e){
		hideModal( $(this) );
		$('.video-modal .modal-video').html('<div id="modal-video-iframe"></div>');
	});

	$('.modal-close, .js-modal-close').click(function(e){
		e.preventDefault();

		hideModal( $(this).closest('.modal') );
		$('.video-modal .modal-video').html('<div id="modal-video-iframe"></div>');
	});

	$('[data-modal]').click(function(e){
		e.preventDefault();
		e.stopPropagation();

		hideModal('.modal');

		if ($(this).data('modal-tab') != undefined) {
			goToTab($(this).data('modal-tab'));
		}

		showModal( $(this).data('modal') );
	});

	// Video
	$('.video-block:not([data-video-modal])').on('click', function () {
		$(this).addClass('playing');
		$(this).find('.block-overlay').fadeOut(300);

		let videoId = $(this).find('.play-btn').data('video-id');

		if (!videoId) {
			videoId = $(this).data('video-id');
		}

		if (videoId == undefined) {
			$(this).find('video')[0].play();
		} else{
			let videoType = $(this).data('video-type') ? $(this).data('video-type').toLowerCase() : 'youtube';

			if (videoType == 'youtube') {
				$(this).find('.block-video-container').append('<div class="video-iframe" id="'+videoId+'"></div>');
				createVideo(videoId, videoId);
			} else if(videoType == 'vimeo'){
				$(this).find('.block-video-container').append('<div class="video-iframe" id="'+videoId+'"><iframe allow="autoplay" class="video-iframe" src="https://player.vimeo.com/video/'+videoId+'?playsinline=1&autoplay=1&transparent=0&app_id=122963"></div>');
			}
		}
	});

	$('[data-video-modal]').click(function(e){
		e.preventDefault();
		e.stopPropagation();

		let videoId = $(this).data('video-modal');
		let videoType = $(this).data('video-type');

		if (videoType == 'youtube') {
			$('#modal-video-iframe').removeClass('vimeo youtube').addClass('youtube').append('<div class="video-iframe" id="'+videoId+'"></div>');
			createVideo(videoId, videoId);
		} else if(videoType == 'vimeo'){
			$('#modal-video-iframe').removeClass('vimeo youtube').addClass('vimeo').html('<iframe class="video-iframe" allow="autoplay" src="https://player.vimeo.com/video/'+videoId+'?playsinline=1&autoplay=1&transparent=1&app_id=122963">');
		}

		hideModal('.modal');

		showModal( "#video-modal" );
	});

	var player;
	function createVideo(videoBlockId, videoId) {
		player = new YT.Player(videoBlockId, {
			videoId: videoId,
			playerVars: {
				'autohide': 1,
				'showinfo' : 0,
				'rel': 0,
				'loop': 1,
				'playsinline': 1,
				'fs': 0,
				'allowsInlineMediaPlayback': true
			},
			events: {
				'onReady': function (e) {
					// e.target.mute();
					// if ($(window).width() > 991) {
						setTimeout(function(){
							e.target.playVideo();
						}, 200);
					// }
				}
			}
		});
	}
});


function getScrollWidth(){
	// create element with scroll
	let div = document.createElement('div');

	div.style.overflowY = 'scroll';
	div.style.width = '50px';
	div.style.height = '50px';

	document.body.append(div);
	let scrollWidth = div.offsetWidth - div.clientWidth;

	div.remove();

	return scrollWidth;
}

let bodyScrolled = 0;
function showModal(modal){
	$(modal).addClass('visible');
	bodyScrolled = $(window).scrollTop();
	$('body').addClass('modal-visible')
			 .scrollTop(bodyScrolled)
			 .css('padding-right', getScrollWidth());
}

function hideModal(modal){
	$(modal).removeClass('visible');
	bodyScrolled = $(window).scrollTop();
	$('body').removeClass('modal-visible')
			 .scrollTop(bodyScrolled)
			 .css('padding-right', 0);
}