import { AddNewMovie } from "../addMovie";
import React from "react";
import ReactDOM from "react-dom";
import { MemoryRouter } from "react-router-dom";

describe("add movie component", () => {
  it("shows movies form", () => {
    const element = document.createElement("div");
    ReactDOM.render(
      <MemoryRouter>
        <AddNewMovie />
      </MemoryRouter>,
      element
    );
    expect(element.innerHTML).toMatchSnapshot();
    expect(
      Array.from(element.querySelectorAll("form label strong")).map(
        (e) => e.innerHTML
      )
    ).toEqual(["Title:", "Plot:", "Country:", "Year:"]);
  });
});
