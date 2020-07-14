const { axios } = require("./fakeBackend/mock");

const getFeedbackByProductViewData = async (product, actualize = false) => {
  try {
    const feedbackResponse = await axios.get("/feedback", {
      params: {
        product,
      },
    });

    const { feedback } = feedbackResponse.data;

    if (feedback.length === 0) {
      return {
        message: "Отзывов пока нет",
      };
    }

    const formattedFeedback = await Promise.all(
      feedback
        .sort((a, b) => a.date - b.date)
        .map(async (item) => {
          const response = await axios("/users", {
            params: { id: item.userId },
          });

          const [user] = response.data.users;

          const date = new Date(item.date);

          return {
            message: item.message,
            date: `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`,
            user: `${user.name} (${user.email})`,
          };
        })
    );

    return {
      feedback: formattedFeedback,
    };
  } catch (error) {
    const { response } = error;

    if (response.status === 404) {
      return {
        message: "Такого продукта не существует",
      };
    }
  }
};

module.exports = { getFeedbackByProductViewData };
