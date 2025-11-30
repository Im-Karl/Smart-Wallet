// Trả về đúng thời gian hiện tại theo giờ Việt Nam (Asia/Ho_Chi_Minh)
const toVNDate = (date = new Date()) => {
  return new Date(
    new Date(date).toLocaleString("en-US", {
      timeZone: "Asia/Ho_Chi_Minh",
    })
  );
};

// Trả về 00:00 của ngày đó theo giờ Việt Nam — dùng cho DailyRecord
const startOfDayVN = (date = new Date()) => {
  const vn = toVNDate(date);
  return new Date(vn.getFullYear(), vn.getMonth(), vn.getDate(), 0, 0, 0, 0);
};

// Trả về 23:59:59 VN — dùng nếu cần lấy hết ngày đó
const endOfDayVN = (date = new Date()) => {
  const vn = toVNDate(date);
  return new Date(vn.getFullYear(), vn.getMonth(), vn.getDate(), 23, 59, 59, 999);
};

module.exports = { toVNDate, startOfDayVN, endOfDayVN };
