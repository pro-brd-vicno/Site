$(document).ready(function () {
    //Карусель асортименту
    $(".range-carousel").slick({
        infinite: true,
        slidesToScroll: 1,
        slidesToShow: 3,
        responsive: [
            {
                breakpoint: 1200,
                settings: {
                    slidesToShow: 2,
                }
            },
            {
                breakpoint: 768,
                settings: {
                    arrows: true,
                    slidesToShow: 1,
                }
            }
        ],
    });

    //Карусель робіт
    const $slider = $('.our-works__slider .slider');

    $slider.on('init reInit afterChange', function (event, slick, currentSlide) {
        const i = (currentSlide ? currentSlide : 0) + 1;
        $('.slider-pagination').text(i + ' / ' + slick.slideCount);
    });

    $slider.slick({
        slidesToShow: 4,
        slidesToScroll: 1,
        arrows: true,
        dots: false,
        responsive: [
            {
                breakpoint: 1400,
                settings: {
                    slidesToShow: 3,
                }
            },
            {
                breakpoint: 992,
                settings: {
                    arrows: true,
                    slidesToShow: 2,
                }
            },
            {
                breakpoint: 768,
                settings: {
                    arrows: true,
                    slidesToShow: 1,
                }
            }
        ],
    });

    $('.testimonials-slider').slick({
        slidesToShow: 3,
        slidesToScroll: 1,
        arrows: true,
        dots: false,
        autoplay: false,
        responsive: [
            {
                breakpoint: 992,
                settings: {
                slidesToShow: 2
                }
            },
            {
                breakpoint: 544,
                settings: {
                slidesToShow: 1
                }
            }
        ]
    });

    $('.faq__item').click(function () {
        $(this).toggleClass('open');
    });

  $(".scroll-link").on("click", function (e) {
    e.preventDefault();
    const targetId = $(this).attr("href");
    const target = $(targetId);

    if (target.length) {
      $('html, body').animate({
        scrollTop: target.offset().top
      }, 100);
    }
  });

   $(".cta-button-js").on("click", function() {
      $(".backdrop").removeClass("is-hidden");
    });

   $(".modal__close-button").on("click", function() {
      $(".backdrop").addClass("is-hidden");
    });

    $('.slick-cloned *').attr('tabindex', '-1');

    const forms = $(".form-js");


    forms.each(function () {
    const form = $(this);
        
    form.on("submit", async function (e) {
      e.preventDefault();

      let isValid = true;

      const name = $.trim(form.find("input[name='name']").val());
      const phone = $.trim(form.find("input[name='phone']").val());
      const serviceInput = form.find("select[name='formSelect']");
      const service = serviceInput.length ? serviceInput.val() : null;

      form.find(".error").text("");
      form.find("input").removeClass("error");

      if (name === "") {
        form.find(".error-name").text("Ім’я обовʼязкове");
        form.find("input[name='name']").addClass("error");
        isValid = false;
      }

      const phoneDigits = phone.replace(/[^\d]/g, ""); 

      const isValidUA = /^(\+?38)?0\d{9}$/.test(phoneDigits);

      if (!isValidUA) {
        form.find(".error-phone").text("Введіть коректний номер телефону");
        form.find("input[name='phone']").addClass("error");
        isValid = false;
      } else {
        form.find(".error-phone").text("");
        form.find("input[name='phone']").removeClass("error");
      }

      if (serviceInput.length && !service) {
        const selectedValue = form.find("select[name='formSelect']").val();

        if (!selectedValue) {
          form.find(".error-service").text("Оберіть послугу зі списку");
          form.find(".select-wrapper").addClass("error");
          isValid = false;
        } else {
          form.find(".error-service").text("");
          form.find(".select-wrapper").removeClass("error");
        }
      }

      if (isValid) {
        alert("Зберігаємо ваші дані");
          
        const data = {
          name: name,
          phone: phone,
          service: service,
          formType: service ? "full" : "short"
        };

        try {
          const response = await fetch("https://provicno-service.onrender.com/api/send", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
          });

          if (response.ok) {
            alert("✅ Заявка надіслана!");
            form[0].reset();
            const backdrop = $(".backdrop");
            if (!backdrop.hasClass("is-hidden")) {
                backdrop.addClass("is-hidden");
            }
          } else {
            alert("Ваші дані не вдалося зберегти");
            const telegramLink = `https://t.me/jullrydyak`;
            window.location.href = telegramLink;
          }
        } catch (error) {
          console.error(error);
          alert("Сталася помилка при підключенні до сервера.");
          const telegramLink = `https://t.me/jullrydyak`;
          window.location.href = telegramLink;
        }
      }
    });
  });

  $(".form input").on("input", function () {
        const $input = $(this);
        const value = $input.val().trim();
        const name = $input.attr("name");
      
        if (name === "name" && value !== "") {
          $input.removeClass("error");
          $(".error-name").text("");
        }
      
        if (name === "phone" && value !== "") {
          $input.removeClass("error");
          $(".error-phone").text("");
        }
    });

    $(".form select").on("change", function () {
        const $select = $(this);
        const name = $select.attr("name");
        const value = $select.val();

        if (name === "formSelect" && value !== "") {
            $select.removeClass("error");
            $(".error-service").text("");
        }
    });
});

