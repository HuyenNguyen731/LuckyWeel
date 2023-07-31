(() => {
  const $ = document.querySelector.bind(document);

  //=====< Biến đánh dấu xem đã quay lần đầu tiên chưa >=====
  let isFirstSpin = true;
  //=====< Biến đánh dấu xem nút có thể được kích hoạt lại hay không >=====
  let canSpinAgain = true;

  let timeRotate = 7000; //7 giây
  let currentRotate = 0;
  let isRotating = false;
  const wheel = $(".wheel");
  const btnWheel = $(".btn--wheel");
  const showMsg = $(".msg");

  //=====< Danh sách 8 màu >=====
  const colors = [
    "#bf0b18",
    "#d5681f",
    "#d7bc12",
    "#61a421",
    "#0f753a",
    "#53b7d2",
    "#157dc5",
    "#a20b4d", // Thêm màu mới vào đây nếu cần
  ];

  //=====< Danh sách phần thưởng >=====
  const listGift = [
    {
      text: "1 kẹo mút",
      percent: 10 / 100,
    },
    {
      text: "1 gói bim bim",
      percent: 10 / 100,
    },
    {
      text: "chúc bạn may mắn lần sau",
      percent: 20 / 100,
    },
    {
      text: "1 gói bim bim",
      percent: 15 / 100,
    },
    {
      text: "1 cốc trà chanh",
      percent: 5 / 100,
    },
    {
      text: "1 kẹo mút",
      percent: 15 / 100,
    },
    {
      text: "1 cốc trà sữa",
      percent: 5 / 100,
    },
    {
      text: "chúc bạn may mắn lần sau",
      percent: 20 / 100,
    },
  ];

  //=====< Số lượng phần thưởng >=====
  const size = listGift.length;

  //=====< Số đo góc của 1 phần thưởng chiếm trên hình tròn >=====
  const rotate = 360 / size;

  //=====< Số đo góc cần để tạo độ nghiêng, 90 độ trừ đi góc của 1 phần thưởng chiếm >=====
  const skewY = 90 - rotate;

  listGift.map((item, index) => {
    //=====< Tạo thẻ li >=====
    const elm = document.createElement("li");

    //=====< Xoay và tạo độ nghiêng cho các thẻ li >=====
    elm.style.transform = `rotate(${rotate * index}deg) skewY(-${skewY}deg)`;

    //=====< Thêm background-color so le nhau và căn giữa cho các thẻ text>=====
    if (index % 2 == 0) {
      elm.innerHTML = `<p style="transform: skewY(${skewY}deg) rotate(${
        rotate / 2
      }deg);" class="text text-1">
			<b>${item.text}</b>
		</p>`;
    } else {
      elm.innerHTML = `<p style="transform: skewY(${skewY}deg) rotate(${
        rotate / 2
      }deg);" class="text text-2">
		<b>${item.text}</b>
		</p>`;
    }

    //=====< Thêm vào thẻ ul >=====
    wheel.appendChild(elm);
  });

  //=====< Cập nhật màu cho từng text-2 và text-1 >=====
  const updateTextColors = () => {
    const textElements = document.querySelectorAll(".text");
    textElements.forEach((textElement, index) => {
      textElement.style.backgroundColor = colors[index];
    });
  };

  /********** Hàm bắt đầu **********/
  const start = () => {
    showMsg.innerHTML = "";
    isRotating = true;
    //=====< Lấy 1 số ngầu nhiên 0 -> 1 >=====
    const random = Math.random();

    //=====< Gọi hàm lấy phần thưởng >=====
    const gift = getGift(random);

    //=====< Số vòng quay: 360 độ = 1 vòng (Góc quay hiện tại) >=====
    currentRotate += 360 * 10;

    //=====< Gọi hàm quay >=====
    rotateWheel(currentRotate, gift.index);

    //=====< Gọi hàm in ra màn hình >=====
    showGift(gift);
  };

  /********** Hàm quay vòng quay **********/
  const rotateWheel = (currentRotate, index) => {
    $(".wheel").style.transform = `rotate(${
      //=====< Góc quay hiện tại trừ góc của phần thưởng>=====
      //=====< Trừ tiếp cho một nửa góc của 1 phần thưởng để đưa mũi tên về chính giữa >=====
      currentRotate - index * rotate - rotate / 2
    }deg)`;
  };

  /********** Hàm lấy phần thưởng **********/
  const getGift = (randomNumber) => {
    let currentPercent = 0;
    let list = [];

    listGift.forEach((item, index) => {
      //=====< Cộng lần lượt phần trăm trúng của các phần thưởng >=====
      currentPercent += item.percent;

      //=====< Số ngẫu nhiên nhỏ hơn hoặc bằng phần trăm hiện tại thì thêm phần thưởng vào danh sách >=====
      if (randomNumber <= currentPercent) {
        list.push({ ...item, index });
      }
    });

    //=====< Phần thưởng đầu tiên trong danh sách là phần thưởng quay được>=====
    return list[0];
  };

  //=====< In phần thưởng ra màn hình >=====
  const showGift = (gift) => {
    let timer = setTimeout(() => {
      isRotating = false;
      showMsg.innerHTML = `Chúc mừng bạn đã nhận được "${gift.text}"`;

      clearTimeout(timer);

      // Sau khi quay xong, không cho phép quay lại lần nữa cho đến sau 2 phút
      canSpinAgain = false;

      // Kích hoạt lại nút quay thưởng sau 2 phút
      setTimeout(() => {
        canSpinAgain = true;
        btnWheel.disabled = false;
      }, 2 * 60 * 1000); // 2 phút (2 * 60 giây * 1000 milliseconds)
    }, timeRotate);
  };

  //=====< Gọi hàm cập nhật màu khi trang tải hoàn tất và sau mỗi lần quay >=====
  window.addEventListener("load", updateTextColors);

  //=====< Sự kiện click nút quay thưởng >=====
  btnWheel.addEventListener("click", () => {
    if (!isRotating && canSpinAgain) {
      if (isFirstSpin) {
        // Quay bánh lần đầu tiên
        start();
        isFirstSpin = false;

        // Vô hiệu hóa nút quay thưởng
        btnWheel.disabled = true;

        // Đặt thời gian chờ 2 phút trước khi kích hoạt lại nút
        setTimeout(() => {
          canSpinAgain = true;
          btnWheel.disabled = false;
        }, 2 * 60 * 1000); // 2 phút (2 * 60 giây * 1000 milliseconds)
      } else {
        // Đã quay lần đầu tiên, không thực hiện gì
        // Bạn có thể thêm xử lý khác ở đây nếu cần
      }
    }
  });
})();
