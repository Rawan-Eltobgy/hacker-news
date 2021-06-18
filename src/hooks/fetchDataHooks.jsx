import { useEffect, useRef, useReducer } from "react";

export const useFetch = (url, detailsUrl, storiesNumber = 10) => {
  const initialState = {
    status: "idle",
    error: null,
    data: [],
    scores: [],
    descendants: [],
  };

  const [state, dispatch] = useReducer((state, action) => {
    switch (action.type) {
      case "FETCHING":
        return { ...initialState, status: "fetching" };
      case "FETCHED":
        return { ...initialState, status: "fetched", data: action.payload };
      case "FETCH_ERROR":
        return { ...initialState, status: "error", error: action.payload };
      case "FETCHED DETAILS":
        return {
          ...initialState,
          status: "fetched Details",
          data: action.payload.data,
          scores: action.payload.scores,
          descendants: action.payload.descendants,
        };
      default:
        return state;
    }
  }, initialState);

  const fetchStoriesIds = async () => {
    const response = await fetch(url);
    const data = await response.json();
    return data;
  };

  useEffect(() => {
    let cancelRequest = false;
    if (!url || !detailsUrl) return;

    const fetchData = async () => {
      dispatch({ type: "FETCHING" });
      try {
        const scores = [],
          descendantsArr = [];
        const data = await fetchStoriesIds();
        await Promise.all([
          ...data.map(async function (item, index) {
            if (index >= storiesNumber) return;
            const storyURL = item && `${detailsUrl}${item}.json?print=pretty`;
            const response = await fetch(storyURL);
            const story = await response.json();
            const { score, descendants } = story;
            scores.push(Number(score));
            descendantsArr.push(Number(descendants));
          }),
        ]);
        dispatch({
          type: "FETCHED DETAILS",
          payload: { data: data, scores: scores, descendants: descendantsArr },
        });
      } catch (error) {
        if (cancelRequest) return;
        dispatch({ type: "FETCH_ERROR", payload: error.message });
      }
    };

    fetchData();

    return function cleanup() {
      cancelRequest = true;
    };
  }, [url, storiesNumber]);

  return state;
};
