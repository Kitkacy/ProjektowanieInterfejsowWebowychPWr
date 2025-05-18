import { jsx, jsxs } from "react/jsx-runtime";
import { PassThrough } from "node:stream";
import { createReadableStreamFromReadable } from "@react-router/node";
import { ServerRouter, useMatches, useActionData, useLoaderData, useParams, useRouteError, Meta, Links, ScrollRestoration, Scripts, Outlet, isRouteErrorResponse, Link, useNavigate } from "react-router";
import { isbot } from "isbot";
import { renderToPipeableStream } from "react-dom/server";
import { createElement, createContext, useState, useContext } from "react";
const streamTimeout = 5e3;
function handleRequest(request, responseStatusCode, responseHeaders, routerContext, loadContext) {
  return new Promise((resolve, reject) => {
    let shellRendered = false;
    let userAgent = request.headers.get("user-agent");
    let readyOption = userAgent && isbot(userAgent) || routerContext.isSpaMode ? "onAllReady" : "onShellReady";
    const { pipe, abort } = renderToPipeableStream(
      /* @__PURE__ */ jsx(ServerRouter, { context: routerContext, url: request.url }),
      {
        [readyOption]() {
          shellRendered = true;
          const body = new PassThrough();
          const stream = createReadableStreamFromReadable(body);
          responseHeaders.set("Content-Type", "text/html");
          resolve(
            new Response(stream, {
              headers: responseHeaders,
              status: responseStatusCode
            })
          );
          pipe(body);
        },
        onShellError(error) {
          reject(error);
        },
        onError(error) {
          responseStatusCode = 500;
          if (shellRendered) {
            console.error(error);
          }
        }
      }
    );
    setTimeout(abort, streamTimeout + 1e3);
  });
}
const entryServer = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: handleRequest,
  streamTimeout
}, Symbol.toStringTag, { value: "Module" }));
function withComponentProps(Component) {
  return function Wrapped() {
    const props = {
      params: useParams(),
      loaderData: useLoaderData(),
      actionData: useActionData(),
      matches: useMatches()
    };
    return createElement(Component, props);
  };
}
function withErrorBoundaryProps(ErrorBoundary3) {
  return function Wrapped() {
    const props = {
      params: useParams(),
      loaderData: useLoaderData(),
      actionData: useActionData(),
      error: useRouteError()
    };
    return createElement(ErrorBoundary3, props);
  };
}
const initialBooks = [
  {
    id: 1,
    title: "How to Talk to Your Cat About Gun Safety",
    author: "John Smith",
    price: 45.99,
    condition: "Like New",
    category: "Guns",
    description: "Do you love your cat? Well, no self-respecting cat mom or dad would let their baby grow up without a solid grounding in gun safety.",
    publishYear: 2021,
    pages: 450,
    language: "English",
    format: "Paperback",
    cover: "/images/covers/1.png",
    hasCover: true
  },
  {
    id: 2,
    title: "How to Survive a Garden Gnome Attack",
    author: "Sarah Johnson",
    price: 38.5,
    condition: "Good",
    category: "Guides",
    description: "Crucial survival information when dealing with one of the world’s smallest menaces.",
    publishYear: 2020,
    pages: 380,
    language: "English",
    format: "Hardcover",
    cover: "/images/covers/2.png",
    hasCover: true
  },
  {
    id: 3,
    title: "Eating People is Wrong",
    author: "Michael Brown",
    price: 52.75,
    condition: "Very Good",
    category: "Psychology",
    description: "The all in one book for the person on the fence.",
    publishYear: 2019,
    pages: 520,
    language: "English",
    format: "Paperback",
    cover: "/images/covers/3.png",
    hasCover: true
  },
  {
    id: 4,
    title: "Crafting with Cat Hair: Cute Handicrafts to Make with Your Cat",
    author: "Emily Chen",
    price: 34.99,
    condition: "Good",
    category: "Guides",
    description: "Have you been storing your cat’s hair, waiting for your moment? Well, your moment is now.",
    publishYear: 2022,
    pages: 310,
    language: "English",
    format: "Paperback",
    cover: "/images/covers/4.jpg",
    hasCover: true
  },
  {
    id: 5,
    title: "The Field Guide to Dumb Birds of North America",
    author: "David Wilson",
    price: 42.25,
    condition: "Like New",
    category: "Guides",
    description: "You may be outwitted by the smart ones, but these ones are more in your grasp.",
    publishYear: 2021,
    pages: 620,
    language: "English",
    format: "Hardcover",
    cover: "/images/covers/5.jpg",
    hasCover: true
  },
  {
    id: 6,
    title: "How to Raise Your I.Q. by Eating Gifted Children",
    author: "Jennifer Adams",
    price: 29.99,
    condition: "Acceptable",
    category: "Psychology",
    description: "Children are the new Super Food.",
    publishYear: 2018,
    pages: 350,
    language: "English",
    format: "Digital",
    cover: "/images/covers/6.jpg",
    hasCover: true
  },
  {
    id: 7,
    title: "Microwave for One",
    author: "Robert Taylor",
    price: 48.5,
    condition: "Very Good",
    category: "Cooking",
    description: "Microwave cooking turned all the way up to 1.",
    publishYear: 2020,
    pages: 480,
    language: "English",
    format: "Paperback",
    cover: "/images/covers/7.jpg",
    hasCover: true
  },
  {
    id: 8,
    title: "Extreme Ironing",
    author: "Amanda Lewis",
    price: 36.75,
    condition: "Good",
    category: "Sports",
    description: "For the adrenaline junky looking to get their fix in this modern crazy world.",
    publishYear: 2019,
    pages: 290,
    language: "English",
    format: "Digital",
    cover: "/images/covers/8.jpg",
    hasCover: true
  }
];
const DEFAULT_COVER = "/images/covers/book-default-cover.jpg";
const BookContext = createContext();
function BookProvider({ children }) {
  const [books, setBooks] = useState(initialBooks);
  const [searchResults, setSearchResults] = useState([]);
  const [filters, setFilters] = useState({
    category: [],
    condition: [],
    format: [],
    priceRange: { min: 0, max: 100 },
    publishYear: []
  });
  const filterOptions = {
    categories: [...new Set(books.map((book) => book.category))],
    conditions: [...new Set(books.map((book) => book.condition))],
    formats: [...new Set(books.map((book) => book.format))],
    publishYears: [...new Set(books.map((book) => book.publishYear))].sort((a, b) => b - a)
  };
  const addBook = (book) => {
    const newBook = {
      ...book,
      id: books.length + 1,
      cover: DEFAULT_COVER,
      hasCover: false
    };
    setBooks([...books, newBook]);
  };
  const removeBook = (id) => {
    setBooks(books.filter((book) => book.id !== id));
  };
  const updateFilters = (filterType, value) => {
    setFilters((prevFilters) => {
      const newFilters = { ...prevFilters };
      if (filterType === "priceRange") {
        newFilters.priceRange = value;
      } else {
        if (newFilters[filterType].includes(value)) {
          newFilters[filterType] = newFilters[filterType].filter((item) => item !== value);
        } else {
          newFilters[filterType] = [...newFilters[filterType], value];
        }
      }
      if (searchResults.length > 0) {
        applyFilters(newFilters);
      }
      return newFilters;
    });
  };
  const applyFilters = (currentFilters = filters) => {
    const query = searchResults.length > 0 ? "" : null;
    searchBooks(query, currentFilters);
  };
  const searchBooks = (query, currentFilters = filters) => {
    let results = [...books];
    if (query && query.trim()) {
      const lowerQuery = query.toLowerCase();
      results = results.filter(
        (book) => book.title.toLowerCase().includes(lowerQuery) || book.author.toLowerCase().includes(lowerQuery) || book.category.toLowerCase().includes(lowerQuery)
      );
    }
    if (currentFilters.category.length > 0) {
      results = results.filter((book) => currentFilters.category.includes(book.category));
    }
    if (currentFilters.condition.length > 0) {
      results = results.filter((book) => currentFilters.condition.includes(book.condition));
    }
    if (currentFilters.format.length > 0) {
      results = results.filter((book) => currentFilters.format.includes(book.format));
    }
    if (currentFilters.publishYear.length > 0) {
      results = results.filter((book) => currentFilters.publishYear.includes(book.publishYear));
    }
    results = results.filter(
      (book) => book.price >= currentFilters.priceRange.min && book.price <= currentFilters.priceRange.max
    );
    setSearchResults(results);
  };
  const resetFilters = () => {
    setFilters({
      category: [],
      condition: [],
      format: [],
      priceRange: { min: 0, max: 100 },
      publishYear: []
    });
    if (searchResults.length > 0) {
      const resetFiltersObj = {
        category: [],
        condition: [],
        format: [],
        priceRange: { min: 0, max: 100 },
        publishYear: []
      };
      searchBooks("", resetFiltersObj);
    }
  };
  return /* @__PURE__ */ jsx(
    BookContext.Provider,
    {
      value: {
        books,
        featuredBooks: books.slice(0, 3),
        searchResults,
        searchBooks,
        filters,
        updateFilters,
        applyFilters,
        resetFilters,
        filterOptions,
        addBook,
        removeBook,
        DEFAULT_COVER
      },
      children
    }
  );
}
function useBooks() {
  return useContext(BookContext);
}
const stylesheet = "/assets/app-DipYrtMw.css";
const links = () => [{
  rel: "preconnect",
  href: "https://fonts.googleapis.com"
}, {
  rel: "preconnect",
  href: "https://fonts.gstatic.com",
  crossOrigin: "anonymous"
}, {
  rel: "stylesheet",
  href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap"
}, {
  rel: "stylesheet",
  href: stylesheet
}];
function Layout({
  children
}) {
  return /* @__PURE__ */ jsxs("html", {
    lang: "en",
    className: "h-full",
    children: [/* @__PURE__ */ jsxs("head", {
      children: [/* @__PURE__ */ jsx("meta", {
        charSet: "utf-8"
      }), /* @__PURE__ */ jsx("meta", {
        name: "viewport",
        content: "width=device-width, initial-scale=1"
      }), /* @__PURE__ */ jsx(Meta, {}), /* @__PURE__ */ jsx(Links, {})]
    }), /* @__PURE__ */ jsxs("body", {
      className: "min-h-full flex flex-col bg-white",
      children: [/* @__PURE__ */ jsx(BookProvider, {
        children
      }), /* @__PURE__ */ jsx(ScrollRestoration, {}), /* @__PURE__ */ jsx(Scripts, {})]
    })]
  });
}
const root = withComponentProps(function App() {
  return /* @__PURE__ */ jsx(Outlet, {});
});
const ErrorBoundary = withErrorBoundaryProps(function ErrorBoundary2({
  error
}) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack;
  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details = error.status === 404 ? "The requested page could not be found." : error.statusText || details;
  }
  return /* @__PURE__ */ jsxs("main", {
    className: "pt-16 p-4 container mx-auto",
    children: [/* @__PURE__ */ jsx("h1", {
      children: message
    }), /* @__PURE__ */ jsx("p", {
      children: details
    }), stack]
  });
});
const route0 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  ErrorBoundary,
  Layout,
  default: root,
  links
}, Symbol.toStringTag, { value: "Module" }));
function BookCover({ book, className }) {
  const { DEFAULT_COVER: DEFAULT_COVER2 } = useBooks();
  if (book.hasCover) {
    return /* @__PURE__ */ jsx("div", { className: "w-full h-full flex justify-center bg-gray-100", children: /* @__PURE__ */ jsx(
      "img",
      {
        src: book.cover,
        alt: `Cover of ${book.title}`,
        className: className || "h-full object-contain"
      }
    ) });
  }
  return /* @__PURE__ */ jsx("div", { className: `flex items-center justify-center bg-gray-100 ${className || "w-full h-full"}`, children: /* @__PURE__ */ jsx("svg", { xmlns: "http://www.w3.org/2000/svg", className: "h-16 w-16 text-gray-400", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" }) }) });
}
function FilterOptions({ isOpen, toggleFilters }) {
  const { filters, updateFilters, resetFilters, filterOptions } = useBooks();
  const [localPriceRange, setLocalPriceRange] = useState(filters.priceRange);
  const handlePriceChange = (type, value) => {
    setLocalPriceRange((prev) => {
      const newRange = { ...prev, [type]: Number(value) };
      return newRange;
    });
  };
  const applyPriceRange = () => {
    updateFilters("priceRange", localPriceRange);
  };
  const toggleFilter = (filterType, value) => {
    updateFilters(filterType, value);
  };
  if (!isOpen) return null;
  return /* @__PURE__ */ jsxs("div", { className: "p-4 bg-white border rounded-lg shadow-md mb-6", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center mb-4", children: [
      /* @__PURE__ */ jsx("h3", { className: "text-lg font-semibold", children: "Filter Options" }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: resetFilters,
            className: "text-gray-500 hover:text-green-600 text-sm mr-4",
            children: "Reset"
          }
        ),
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: toggleFilters,
            className: "text-gray-500 hover:text-green-600",
            children: /* @__PURE__ */ jsx("svg", { xmlns: "http://www.w3.org/2000/svg", className: "h-5 w-5", viewBox: "0 0 20 20", fill: "currentColor", children: /* @__PURE__ */ jsx("path", { fillRule: "evenodd", d: "M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z", clipRule: "evenodd" }) })
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4", children: [
      /* @__PURE__ */ jsxs("div", { className: "mb-4", children: [
        /* @__PURE__ */ jsx("h4", { className: "font-medium mb-2 text-sm", children: "Categories" }),
        /* @__PURE__ */ jsx("div", { className: "space-y-2 max-h-40 overflow-y-auto", children: filterOptions.categories.map((category) => /* @__PURE__ */ jsxs("div", { className: "flex items-center", children: [
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "checkbox",
              id: `category-${category}`,
              checked: filters.category.includes(category),
              onChange: () => toggleFilter("category", category),
              className: "mr-2"
            }
          ),
          /* @__PURE__ */ jsx("label", { htmlFor: `category-${category}`, className: "text-sm", children: category })
        ] }, category)) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "mb-4", children: [
        /* @__PURE__ */ jsx("h4", { className: "font-medium mb-2 text-sm", children: "Condition" }),
        /* @__PURE__ */ jsx("div", { className: "space-y-2", children: filterOptions.conditions.map((condition) => /* @__PURE__ */ jsxs("div", { className: "flex items-center", children: [
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "checkbox",
              id: `condition-${condition}`,
              checked: filters.condition.includes(condition),
              onChange: () => toggleFilter("condition", condition),
              className: "mr-2"
            }
          ),
          /* @__PURE__ */ jsx("label", { htmlFor: `condition-${condition}`, className: "text-sm", children: condition })
        ] }, condition)) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "mb-4", children: [
        /* @__PURE__ */ jsx("h4", { className: "font-medium mb-2 text-sm", children: "Format" }),
        /* @__PURE__ */ jsx("div", { className: "space-y-2", children: filterOptions.formats.map((format) => /* @__PURE__ */ jsxs("div", { className: "flex items-center", children: [
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "checkbox",
              id: `format-${format}`,
              checked: filters.format.includes(format),
              onChange: () => toggleFilter("format", format),
              className: "mr-2"
            }
          ),
          /* @__PURE__ */ jsx("label", { htmlFor: `format-${format}`, className: "text-sm", children: format })
        ] }, format)) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "mb-4", children: [
        /* @__PURE__ */ jsx("h4", { className: "font-medium mb-2 text-sm", children: "Publication Year" }),
        /* @__PURE__ */ jsx("div", { className: "space-y-2 max-h-40 overflow-y-auto", children: filterOptions.publishYears.map((year) => /* @__PURE__ */ jsxs("div", { className: "flex items-center", children: [
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "checkbox",
              id: `year-${year}`,
              checked: filters.publishYear.includes(year),
              onChange: () => toggleFilter("publishYear", year),
              className: "mr-2"
            }
          ),
          /* @__PURE__ */ jsx("label", { htmlFor: `year-${year}`, className: "text-sm", children: year })
        ] }, year)) })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "mt-4", children: [
      /* @__PURE__ */ jsx("h4", { className: "font-medium mb-2 text-sm", children: "Price Range ($)" }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-4", children: [
        /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx(
          "input",
          {
            type: "number",
            min: "0",
            value: localPriceRange.min,
            onChange: (e) => handlePriceChange("min", e.target.value),
            className: "w-16 p-2 border rounded-lg text-sm",
            placeholder: "Min"
          }
        ) }),
        /* @__PURE__ */ jsx("span", { className: "text-gray-400", children: "to" }),
        /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx(
          "input",
          {
            type: "number",
            min: "0",
            value: localPriceRange.max,
            onChange: (e) => handlePriceChange("max", e.target.value),
            className: "w-16 p-2 border rounded-lg text-sm",
            placeholder: "Max"
          }
        ) }),
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: applyPriceRange,
            className: "bg-green-600 text-white px-3 py-1 rounded-lg text-sm",
            children: "Apply"
          }
        )
      ] })
    ] })
  ] });
}
function SearchBar() {
  const [query, setQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const { searchBooks } = useBooks();
  const handleSearch = (e) => {
    e.preventDefault();
    searchBooks(query);
  };
  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };
  return /* @__PURE__ */ jsxs("div", { children: [
    /* @__PURE__ */ jsx("form", { onSubmit: handleSearch, className: "w-full max-w-xl mx-auto", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center border rounded-lg overflow-hidden", children: [
      /* @__PURE__ */ jsx(
        "input",
        {
          type: "text",
          value: query,
          onChange: (e) => setQuery(e.target.value),
          placeholder: "Search by title, author or category...",
          className: "w-full py-2 px-4 focus:outline-none rounded-l-lg"
        }
      ),
      /* @__PURE__ */ jsx(
        "button",
        {
          type: "button",
          onClick: toggleFilters,
          className: "px-2 py-2 text-gray-500 hover:text-green-600",
          title: "Show filters",
          children: /* @__PURE__ */ jsx("svg", { xmlns: "http://www.w3.org/2000/svg", className: "h-5 w-5", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" }) })
        }
      ),
      /* @__PURE__ */ jsx(
        "button",
        {
          type: "submit",
          className: "bg-green-600 text-white px-4 py-2 hover:bg-green-700 rounded-r-lg",
          children: /* @__PURE__ */ jsx("svg", { xmlns: "http://www.w3.org/2000/svg", className: "h-5 w-5", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" }) })
        }
      )
    ] }) }),
    /* @__PURE__ */ jsx("div", { className: "mt-4", children: /* @__PURE__ */ jsx(FilterOptions, { isOpen: showFilters, toggleFilters }) })
  ] });
}
function SearchResults() {
  const { searchResults, filters, removeBook } = useBooks();
  if (searchResults.length === 0) {
    return null;
  }
  const hasActiveFilters = filters.category.length > 0 || filters.condition.length > 0 || filters.format.length > 0 || filters.publishYear.length > 0 || filters.priceRange.min > 0 || filters.priceRange.max < 100;
  return /* @__PURE__ */ jsxs("div", { className: "mt-6 w-full max-w-4xl mx-auto", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center mb-4", children: [
      /* @__PURE__ */ jsxs("h3", { className: "text-xl font-semibold", children: [
        "Search Results (",
        searchResults.length,
        ")"
      ] }),
      hasActiveFilters && /* @__PURE__ */ jsx("span", { className: "text-sm text-green-600", children: "Filters applied" })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "bg-white rounded-lg border shadow-sm", children: searchResults.map((book) => /* @__PURE__ */ jsxs("div", { className: "border-b p-4 flex justify-between items-center", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h4", { className: "font-medium", children: book.title }),
        /* @__PURE__ */ jsx("p", { className: "text-gray-600 text-sm", children: book.author }),
        /* @__PURE__ */ jsxs("div", { className: "flex gap-2 text-xs mt-1", children: [
          /* @__PURE__ */ jsx("span", { className: "bg-gray-100 px-2 py-1 rounded-lg", children: book.category }),
          /* @__PURE__ */ jsx("span", { className: "bg-gray-100 px-2 py-1 rounded-lg", children: book.condition }),
          /* @__PURE__ */ jsx("span", { className: "bg-gray-100 px-2 py-1 rounded-lg", children: book.format }),
          /* @__PURE__ */ jsx("span", { className: "bg-gray-100 px-2 py-1 rounded-lg", children: book.publishYear })
        ] }),
        /* @__PURE__ */ jsxs("p", { className: "text-gray-500 text-xs mt-1", children: [
          book.pages,
          " pages"
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-end", children: [
        /* @__PURE__ */ jsxs("span", { className: "font-bold text-lg text-green-600", children: [
          "$",
          book.price.toFixed(2)
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex gap-2 mt-2", children: [
          /* @__PURE__ */ jsx("button", { className: "text-green-600 text-sm hover:underline", children: "View Details" }),
          /* @__PURE__ */ jsx("button", { className: "text-green-600 text-sm hover:underline", children: "Edit" }),
          /* @__PURE__ */ jsx(
            "button",
            {
              className: "text-red-600 text-sm hover:underline",
              onClick: () => removeBook(book.id),
              children: "Delete"
            }
          )
        ] })
      ] })
    ] }, book.id)) })
  ] });
}
function Welcome() {
  const { featuredBooks } = useBooks();
  return /* @__PURE__ */ jsxs("main", { className: "flex flex-col items-center", children: [
    /* @__PURE__ */ jsx("header", { className: "w-full bg-green-700 text-white p-4 flex justify-between items-center", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 max-w-6xl mx-auto w-full", children: [
      /* @__PURE__ */ jsx("svg", { xmlns: "http://www.w3.org/2000/svg", className: "h-8 w-8", viewBox: "0 0 20 20", fill: "currentColor", children: /* @__PURE__ */ jsx("path", { d: "M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.38A7.968 7.968 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.969 7.969 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" }) }),
      /* @__PURE__ */ jsx("h1", { className: "text-2xl font-bold", children: "Books4Cash.io" }),
      /* @__PURE__ */ jsx("nav", { className: "ml-auto", children: /* @__PURE__ */ jsxs("ul", { className: "flex gap-6 items-center", children: [
        /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx("a", { href: "#", className: "hover:underline", children: "Buy" }) }),
        /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx("a", { href: "#", className: "hover:underline", children: "Sell" }) }),
        /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx("a", { href: "#", className: "hover:underline", children: "About" }) }),
        /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx("a", { href: "#", className: "hover:underline", children: "Contact" }) }),
        /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx("button", { className: "bg-white text-green-700 px-3 py-1 rounded-lg hover:bg-green-50", children: "Login" }) })
      ] }) })
    ] }) }),
    /* @__PURE__ */ jsxs("div", { className: "w-full bg-gray-50 p-12 text-center rounded-lg mt-4 mb-4", children: [
      /* @__PURE__ */ jsx("h2", { className: "text-4xl font-bold mb-4", children: "Turn Your Books Into Cash" }),
      /* @__PURE__ */ jsx("p", { className: "text-xl text-gray-700 mb-6", children: "Buy and sell used books using our military-grade internet technology AI+™" }),
      /* @__PURE__ */ jsx("div", { className: "flex justify-center", children: /* @__PURE__ */ jsx(
        Link,
        {
          to: "/new",
          className: "bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700",
          children: "Add New Book"
        }
      ) })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "w-full max-w-6xl mx-auto p-8", children: [
      /* @__PURE__ */ jsx(SearchBar, {}),
      /* @__PURE__ */ jsx(SearchResults, {})
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "max-w-6xl w-full p-8", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center mb-6", children: [
        /* @__PURE__ */ jsx("h2", { className: "text-2xl font-semibold", children: "Featured Books" }),
        /* @__PURE__ */ jsxs(Link, { to: "/new", className: "text-green-600 hover:underline flex items-center gap-1", children: [
          /* @__PURE__ */ jsx("svg", { xmlns: "http://www.w3.org/2000/svg", className: "h-4 w-4", viewBox: "0 0 20 20", fill: "currentColor", children: /* @__PURE__ */ jsx("path", { fillRule: "evenodd", d: "M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z", clipRule: "evenodd" }) }),
          "Add New Book"
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-6", children: featuredBooks.map((book) => /* @__PURE__ */ jsxs("div", { className: "border rounded-lg overflow-hidden shadow-sm hover:shadow-md flex flex-col", children: [
        /* @__PURE__ */ jsx("div", { className: "h-64 bg-gray-100", children: /* @__PURE__ */ jsx(BookCover, { book }) }),
        /* @__PURE__ */ jsxs("div", { className: "p-4 flex flex-col flex-grow", children: [
          /* @__PURE__ */ jsx("h3", { className: "font-semibold", children: book.title }),
          /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-600", children: book.author }),
          /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center mt-3", children: [
            /* @__PURE__ */ jsxs("span", { className: "font-bold text-lg text-green-600", children: [
              "$",
              book.price
            ] }),
            /* @__PURE__ */ jsx("span", { className: "text-sm text-gray-500", children: book.condition })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex justify-end gap-2 mt-3", children: [
            /* @__PURE__ */ jsx("button", { className: "text-green-600 text-sm hover:underline", children: "Edit" }),
            /* @__PURE__ */ jsx("button", { className: "text-red-600 text-sm hover:underline", children: "Delete" })
          ] })
        ] })
      ] }, book.id)) }),
      /* @__PURE__ */ jsx("div", { className: "text-center mt-8", children: /* @__PURE__ */ jsx("a", { href: "#", className: "text-green-600 hover:underline", children: "Browse all books →" }) })
    ] }),
    /* @__PURE__ */ jsx("footer", { className: "w-full bg-gray-800 text-white p-6 mt-auto", children: /* @__PURE__ */ jsxs("div", { className: "max-w-6xl mx-auto", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex flex-col md:flex-row justify-between", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("h3", { className: "text-xl font-bold mb-4", children: "Books4Cash.io" }),
          /* @__PURE__ */ jsx("p", { className: "text-gray-300", children: "The snappy way to buy books." })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-x-16 gap-y-4 mt-6 md:mt-0", children: [
          /* @__PURE__ */ jsx("a", { href: "#", className: "hover:underline", children: "About" }),
          /* @__PURE__ */ jsx("a", { href: "#", className: "hover:underline", children: "Help" }),
          /* @__PURE__ */ jsx("a", { href: "#", className: "hover:underline", children: "Privacy" }),
          /* @__PURE__ */ jsx("a", { href: "#", className: "hover:underline", children: "ToS" }),
          /* @__PURE__ */ jsx("a", { href: "#", className: "hover:underline", children: "Contact" }),
          /* @__PURE__ */ jsx("a", { href: "#", className: "hover:underline", children: "Blog" })
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "mt-8 pt-4 border-t border-gray-700 text-center text-gray-400", children: /* @__PURE__ */ jsx("p", { children: "© 2025 Books4Cash.io. All rights reserved." }) })
    ] }) })
  ] });
}
function meta$1() {
  return [{
    title: "New React Router App"
  }, {
    name: "description",
    content: "Welcome to React Router!"
  }];
}
const home = withComponentProps(function Home() {
  return /* @__PURE__ */ jsx(Welcome, {});
});
const route1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: home,
  meta: meta$1
}, Symbol.toStringTag, { value: "Module" }));
function meta() {
  return [{
    title: "Add New Book - Books4Cash"
  }, {
    name: "description",
    content: "Add a new book for sale on Books4Cash"
  }];
}
const _new = withComponentProps(function NewBook() {
  const {
    addBook,
    filterOptions
  } = useBooks();
  const navigate = useNavigate();
  const [bookData, setBookData] = useState({
    title: "",
    author: "",
    price: "",
    condition: "Good",
    category: "True Crime",
    description: "",
    publishYear: 2025,
    pages: "",
    language: "English",
    format: "Paperback"
  });
  const handleChange = (e) => {
    const {
      name,
      value
    } = e.target;
    setBookData((prev) => ({
      ...prev,
      [name]: name === "price" || name === "pages" || name === "publishYear" ? Number(value) : value
    }));
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!bookData.title || !bookData.author || !bookData.price) {
      alert("Please fill in all required fields");
      return;
    }
    addBook(bookData);
    navigate("/");
  };
  return /* @__PURE__ */ jsxs("main", {
    className: "flex flex-col items-center pt-16 pb-4",
    children: [/* @__PURE__ */ jsxs("header", {
      className: "w-full bg-green-700 text-white p-4 flex justify-between items-center fixed top-0 left-0",
      children: [/* @__PURE__ */ jsx("div", {
        className: "flex items-center gap-2",
        children: /* @__PURE__ */ jsxs(Link, {
          to: "/",
          className: "flex items-center gap-2",
          children: [/* @__PURE__ */ jsx("svg", {
            xmlns: "http://www.w3.org/2000/svg",
            className: "h-8 w-8",
            viewBox: "0 0 20 20",
            fill: "currentColor",
            children: /* @__PURE__ */ jsx("path", {
              d: "M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.38A7.968 7.968 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.969 7.969 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z"
            })
          }), /* @__PURE__ */ jsx("h1", {
            className: "text-2xl font-bold",
            children: "Books4Cash.io"
          })]
        })
      }), /* @__PURE__ */ jsx("nav", {
        children: /* @__PURE__ */ jsxs("ul", {
          className: "flex gap-6 items-center",
          children: [/* @__PURE__ */ jsx("li", {
            children: /* @__PURE__ */ jsx(Link, {
              to: "/",
              className: "hover:underline",
              children: "Home"
            })
          }), /* @__PURE__ */ jsx("li", {
            children: /* @__PURE__ */ jsx("button", {
              className: "bg-white text-green-700 px-3 py-1 rounded-lg hover:bg-green-50",
              children: "Login"
            })
          })]
        })
      })]
    }), /* @__PURE__ */ jsxs("div", {
      className: "w-full max-w-4xl mx-auto p-8",
      children: [/* @__PURE__ */ jsxs("div", {
        className: "flex items-center mb-8",
        children: [/* @__PURE__ */ jsx(Link, {
          to: "/",
          className: "text-green-600 hover:underline mr-2",
          children: "← Back to Home"
        }), /* @__PURE__ */ jsx("h2", {
          className: "text-2xl font-semibold ml-4",
          children: "Add New Book"
        })]
      }), /* @__PURE__ */ jsxs("form", {
        onSubmit: handleSubmit,
        className: "bg-white p-6 rounded-lg border shadow-sm",
        children: [/* @__PURE__ */ jsxs("div", {
          className: "grid grid-cols-1 md:grid-cols-2 gap-6",
          children: [/* @__PURE__ */ jsxs("div", {
            children: [/* @__PURE__ */ jsx("label", {
              htmlFor: "title",
              className: "block text-sm font-medium text-gray-700 mb-1",
              children: "Title *"
            }), /* @__PURE__ */ jsx("input", {
              type: "text",
              id: "title",
              name: "title",
              value: bookData.title,
              onChange: handleChange,
              className: "w-full p-2 border rounded focus:ring focus:ring-blue-200 focus:border-blue-500",
              required: true
            })]
          }), /* @__PURE__ */ jsxs("div", {
            children: [/* @__PURE__ */ jsx("label", {
              htmlFor: "author",
              className: "block text-sm font-medium text-gray-700 mb-1",
              children: "Author *"
            }), /* @__PURE__ */ jsx("input", {
              type: "text",
              id: "author",
              name: "author",
              value: bookData.author,
              onChange: handleChange,
              className: "w-full p-2 border rounded focus:ring focus:ring-blue-200 focus:border-blue-500",
              required: true
            })]
          }), /* @__PURE__ */ jsxs("div", {
            children: [/* @__PURE__ */ jsx("label", {
              htmlFor: "price",
              className: "block text-sm font-medium text-gray-700 mb-1",
              children: "Price ($) *"
            }), /* @__PURE__ */ jsx("input", {
              type: "number",
              step: "0.01",
              id: "price",
              name: "price",
              value: bookData.price,
              onChange: handleChange,
              className: "w-full p-2 border rounded focus:ring focus:ring-blue-200 focus:border-blue-500",
              required: true
            })]
          }), /* @__PURE__ */ jsxs("div", {
            children: [/* @__PURE__ */ jsx("label", {
              htmlFor: "condition",
              className: "block text-sm font-medium text-gray-700 mb-1",
              children: "Condition"
            }), /* @__PURE__ */ jsx("select", {
              id: "condition",
              name: "condition",
              value: bookData.condition,
              onChange: handleChange,
              className: "w-full p-2 border rounded focus:ring focus:ring-blue-200 focus:border-blue-500",
              children: filterOptions.conditions.map((condition) => /* @__PURE__ */ jsx("option", {
                value: condition,
                children: condition
              }, condition))
            })]
          }), /* @__PURE__ */ jsxs("div", {
            children: [/* @__PURE__ */ jsx("label", {
              htmlFor: "category",
              className: "block text-sm font-medium text-gray-700 mb-1",
              children: "Category"
            }), /* @__PURE__ */ jsx("select", {
              id: "category",
              name: "category",
              value: bookData.category,
              onChange: handleChange,
              className: "w-full p-2 border rounded focus:ring focus:ring-blue-200 focus:border-blue-500",
              children: filterOptions.categories.map((category) => /* @__PURE__ */ jsx("option", {
                value: category,
                children: category
              }, category))
            })]
          }), /* @__PURE__ */ jsxs("div", {
            children: [/* @__PURE__ */ jsx("label", {
              htmlFor: "format",
              className: "block text-sm font-medium text-gray-700 mb-1",
              children: "Format"
            }), /* @__PURE__ */ jsx("select", {
              id: "format",
              name: "format",
              value: bookData.format,
              onChange: handleChange,
              className: "w-full p-2 border rounded focus:ring focus:ring-blue-200 focus:border-blue-500",
              children: filterOptions.formats.map((format) => /* @__PURE__ */ jsx("option", {
                value: format,
                children: format
              }, format))
            })]
          }), /* @__PURE__ */ jsxs("div", {
            children: [/* @__PURE__ */ jsx("label", {
              htmlFor: "publishYear",
              className: "block text-sm font-medium text-gray-700 mb-1",
              children: "Publication Year"
            }), /* @__PURE__ */ jsx("select", {
              id: "publishYear",
              name: "publishYear",
              value: bookData.publishYear,
              onChange: handleChange,
              className: "w-full p-2 border rounded focus:ring focus:ring-blue-200 focus:border-blue-500",
              children: [...Array(10)].map((_, i) => {
                const year = 2023 - i;
                return /* @__PURE__ */ jsx("option", {
                  value: year,
                  children: year
                }, year);
              })
            })]
          }), /* @__PURE__ */ jsxs("div", {
            children: [/* @__PURE__ */ jsx("label", {
              htmlFor: "pages",
              className: "block text-sm font-medium text-gray-700 mb-1",
              children: "Pages"
            }), /* @__PURE__ */ jsx("input", {
              type: "number",
              id: "pages",
              name: "pages",
              value: bookData.pages,
              onChange: handleChange,
              className: "w-full p-2 border rounded focus:ring focus:ring-blue-200 focus:border-blue-500"
            })]
          })]
        }), /* @__PURE__ */ jsxs("div", {
          className: "mt-6",
          children: [/* @__PURE__ */ jsx("label", {
            htmlFor: "description",
            className: "block text-sm font-medium text-gray-700 mb-1",
            children: "Description"
          }), /* @__PURE__ */ jsx("textarea", {
            id: "description",
            name: "description",
            rows: "4",
            value: bookData.description,
            onChange: handleChange,
            className: "w-full p-2 border rounded focus:ring focus:ring-blue-200 focus:border-blue-500"
          })]
        }), /* @__PURE__ */ jsxs("div", {
          className: "flex justify-between mt-8",
          children: [/* @__PURE__ */ jsx("button", {
            type: "button",
            onClick: () => navigate("/"),
            className: "px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100",
            children: "Cancel"
          }), /* @__PURE__ */ jsx("button", {
            type: "submit",
            className: "px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700",
            children: "Add Book"
          })]
        })]
      })]
    })]
  });
});
const route2 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: _new,
  meta
}, Symbol.toStringTag, { value: "Module" }));
const serverManifest = { "entry": { "module": "/assets/entry.client-CIx7IEn2.js", "imports": ["/assets/chunk-AYJ5UCUI-CtDWdivH.js"], "css": [] }, "routes": { "root": { "id": "root", "parentId": void 0, "path": "", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": true, "module": "/assets/root-B_oQSpn5.js", "imports": ["/assets/chunk-AYJ5UCUI-CtDWdivH.js", "/assets/BookContext-BfAT3Bhj.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/home": { "id": "routes/home", "parentId": "root", "path": void 0, "index": true, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/home-0xiF1qqS.js", "imports": ["/assets/BookContext-BfAT3Bhj.js", "/assets/chunk-AYJ5UCUI-CtDWdivH.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/new": { "id": "routes/new", "parentId": "root", "path": "/new", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/new-CVDAv1kC.js", "imports": ["/assets/BookContext-BfAT3Bhj.js", "/assets/chunk-AYJ5UCUI-CtDWdivH.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 } }, "url": "/assets/manifest-0f85e3a8.js", "version": "0f85e3a8", "sri": void 0 };
const assetsBuildDirectory = "build/client";
const basename = "/";
const future = { "unstable_middleware": false, "unstable_optimizeDeps": false, "unstable_splitRouteModules": false, "unstable_subResourceIntegrity": false, "unstable_viteEnvironmentApi": false };
const ssr = true;
const isSpaMode = false;
const prerender = [];
const publicPath = "/";
const entry = { module: entryServer };
const routes = {
  "root": {
    id: "root",
    parentId: void 0,
    path: "",
    index: void 0,
    caseSensitive: void 0,
    module: route0
  },
  "routes/home": {
    id: "routes/home",
    parentId: "root",
    path: void 0,
    index: true,
    caseSensitive: void 0,
    module: route1
  },
  "routes/new": {
    id: "routes/new",
    parentId: "root",
    path: "/new",
    index: void 0,
    caseSensitive: void 0,
    module: route2
  }
};
export {
  serverManifest as assets,
  assetsBuildDirectory,
  basename,
  entry,
  future,
  isSpaMode,
  prerender,
  publicPath,
  routes,
  ssr
};
