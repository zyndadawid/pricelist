export type Status = "available" | "reserved" | "exhibition" | "sold";
export type Currency = "PLN" | "EUR";
export type Language = "PL" | "EN" | "FR";
export type Artwork = {
  id: string;
  title: string;
  year: number;
  dimensions: string;
  medium: Record<Language, string>;
  prices: Record<Currency, number | null>;
  status: Status;
  description: Record<Language, string>;
  images: { src: string; alt: string }[];
};

export const artworks: Artwork[] = [
  {
    id: "event-horizon-gw150914-36m-29m",
    title: "event horizon GW150914 36m/29m",
    year: 2026,
    dimensions: "h:72x55x58cm",
    medium: {
      PL: "kamionka toczona na kole garncarskim, szlifowane szkło",
      EN: "wheel-thrown stoneware, polished glass",
      FR: "grès tourné au tour de potier, verre poli",
    },
    prices: { PLN: 21900, EUR: 5700 },

    status: "exhibition",
    description: {
      PL: "",
      EN: "",
      FR: "",
    },
    images: [
      {
        src: "/artworks/event-horizon-gw150914-36m-29m/event-horizon-gw150914-36m-29m-04-large.webp",
        alt: "even horizon gw150914 36m/29m — photo 4",
      },
      {
        src: "/artworks/event-horizon-gw150914-36m-29m/event-horizon-gw150914-36m-29m-05-large.webp",
        alt: "even horizon gw150914 36m/29m — photo 5",
      },
      {
        src: "/artworks/event-horizon-gw150914-36m-29m/event-horizon-gw150914-36m-29m-03-large.webp",
        alt: "even horizon gw150914 36m/29m — photo 3",
      },
      {
        src: "/artworks/event-horizon-gw150914-36m-29m/event-horizon-gw150914-36m-29m-04-large.webp",
        alt: "even horizon gw150914 36m/29m — photo 4",
      },
      {
        src: "/artworks/event-horizon-gw150914-36m-29m/event-horizon-gw150914-36m-29m-06-large.webp",
        alt: "even horizon gw150914 36m/29m — photo 6",
      },
      {
        src: "/artworks/event-horizon-gw150914-36m-29m/event-horizon-gw150914-36m-29m-07-large.webp",
        alt: "even horizon gw150914 36m/29m — photo 7",
      },
    ],
  },
  {
    id: "event-horizon-oj-287",
    title: "event horizon OJ 287",
    year: 2025,
    dimensions: "h:45x58x45cm",
    medium: {
      PL: "kamionka toczona na kole garncarskim, szlifowane szkło",
      EN: "wheel-thrown stoneware, polished glass",
      FR: "grès tourné au tour de potier, verre poli",
    },
    prices: { PLN: 8000, EUR: 1850 },

    status: "available",
    description: {
      PL: "prezentowana na XVII Międzynarodowym Biennale Ceramiki w Manises, Hiszpania 2026",
      EN: "Exhibited at the 17th International Ceramics Biennial in Manises, Spain, 2026",
      FR: "Présentée à la XVIIe Biennale internationale de céramique de Manises, Espagne, 2026",
    },
    images: [
      {
        src: "/artworks/event-horizon-oj-287/event-horizon-oj-287-01-large.webp",
        alt: "even horizon OJ 287 — photo 1",
      },
      {
        src: "/artworks/event-horizon-oj-287/event-horizon-oj-287-02-large.webp",
        alt: "even horizon OJ 287 — photo 2",
      },
      {
        src: "/artworks/event-horizon-oj-287/event-horizon-oj-287-03-large.webp",
        alt: "even horizon OJ 287 — photo 3",
      },
      {
        src: "/artworks/event-horizon-oj-287/event-horizon-oj-287-04-large.webp",
        alt: "even horizon OJ 287 — photo 4",
      },
      {
        src: "/artworks/event-horizon-oj-287/event-horizon-oj-287-05-large.webp",
        alt: "even horizon OJ 287 — photo 5",
      },
    ],
  },
  {
    id: "event-horizon-grs-1915-105",
    title: "event horizon GRS 1915+105",
    year: 2026,
    dimensions: "h:42x60x38cm",
    medium: {
      PL: "kamionka toczona na kole garncarskim, szlifowane szkło",
      EN: "wheel-thrown stoneware, polished glass",
      FR: "grès tourné au tour de potier, verre poli",
    },
    prices: { PLN: 7000, EUR: 1600 },

    status: "available",
    description: {
      PL: "",
      EN: "",
      FR: "",
    },
    images: [
      {
        src: "/artworks/event-horizon-grs-1915-105/event-horizon-grs-1915-105-01-large.webp",
        alt: "event horizon GRS 1915+105 — photo 1",
      },
      {
        src: "/artworks/event-horizon-grs-1915-105/event-horizon-grs-1915-105-02-large.webp",
        alt: "event horizon GRS 1915+105 — photo 2",
      },
      {
        src: "/artworks/event-horizon-grs-1915-105/event-horizon-grs-1915-105-03-large.webp",
        alt: "event horizon GRS 1915+105 — photo 3",
      },
      {
        src: "/artworks/event-horizon-grs-1915-105/event-horizon-grs-1915-105-04-large.webp",
        alt: "event horizon GRS 1915+105 — photo 4",
      },
      {
        src: "/artworks/event-horizon-grs-1915-105/event-horizon-grs-1915-105-05-large.webp",
        alt: "event horizon GRS 1915+105 — photo 5",
      },
    ],
  },
  {
    id: "event-horizon-m87",
    title: "event horizon M87",
    year: 2025,
    dimensions: "h:48x65x50cm",
    medium: {
      PL: "kamionka toczona na kole garncarskim, szlifowane szkło",
      EN: "wheel-thrown stoneware, polished glass",
      FR: "grès tourné au tour de potier, verre poli",
    },
    prices: { PLN: 5000, EUR: 1150 },

    status: "available",
    description: {
      PL: "",
      EN: "",
      FR: "",
    },
    images: [
      {
        src: "/artworks/event-horizon-m87/event-horizon-m87-01-large.webp",
        alt: "event horizon M87 — photo 1",
      },
      {
        src: "/artworks/event-horizon-m87/event-horizon-m87-02-large.webp",
        alt: "event horizon M87 — photo 2",
      },
      {
        src: "/artworks/event-horizon-m87/event-horizon-m87-03-large.webp",
        alt: "event horizon M87 — photo 3",
      },
      {
        src: "/artworks/event-horizon-m87/event-horizon-m87-04-large.webp",
        alt: "event horizon M87 — photo 4",
      },
      {
        src: "/artworks/event-horizon-m87/event-horizon-m87-05-large.webp",
        alt: "event horizon M87 — photo 5",
      },
      {
        src: "/artworks/event-horizon-m87/event-horizon-m87-06-large.webp",
        alt: "event horizon M87 — photo 6",
      },
      {
        src: "/artworks/event-horizon-m87/event-horizon-m87-07-large.webp",
        alt: "event horizon M87 — photo 7",
      },
    ],
  },
  {
    id: "event-horizon-cygnus-x-1",
    title: "event horizon Cygnus X-1",
    year: 2025,
    dimensions: "h:42x42x30cm",
    medium: {
      PL: "kamionka toczona na kole garncarskim, szlifowane szkło",
      EN: "wheel-thrown stoneware, polished glass",
      FR: "grès tourné au tour de potier, verre poli",
    },
    prices: { PLN: 5000, EUR: 1150 },

    status: "available",
    description: {
      PL: "",
      EN: "",
      FR: "",
    },
    images: [
      {
        src: "/artworks/event-horizon-cygnus-x-1/event-horizon-cygnus-x-1-09-large.webp",
        alt: "event horizon Cygnus X-1 — photo 9",
      },
      {
        src: "/artworks/event-horizon-cygnus-x-1/event-horizon-cygnus-x-1-01-large.webp",
        alt: "event horizon Cygnus X-1 — photo 1",
      },

      {
        src: "/artworks/event-horizon-cygnus-x-1/event-horizon-cygnus-x-1-05-large.webp",
        alt: "event horizon Cygnus X-1 — photo 5",
      },
      {
        src: "/artworks/event-horizon-cygnus-x-1/event-horizon-cygnus-x-1-06-large.webp",
        alt: "event horizon Cygnus X-1 — photo 6",
      },
      {
        src: "/artworks/event-horizon-cygnus-x-1/event-horizon-cygnus-x-1-07-large.webp",
        alt: "event horizon Cygnus X-1 — photo 7",
      },
      {
        src: "/artworks/event-horizon-cygnus-x-1/event-horizon-cygnus-x-1-08-large.webp",
        alt: "event horizon Cygnus X-1 — photo 8",
      },
    ],
  },
  // {
  //   id: "event-horizon-mini-1198",
  //   title: "event horizon MINI 1198",
  //   year: 2026,
  //   dimensions: "",
  //   medium: "",
  //   prices: { PLN: 4800, EUR: 1150 },

  //   status: "sold",
  //   description: "",
  //   images: [
  //     {
  //       src: "/artworks/event-horizon-mini-1198/event-horizon-mini-1198-01-large.webp",
  //       alt: "event horizon MINI 1198 — photo 1",
  //     },
  //     {
  //       src: "/artworks/event-horizon-mini-1198/event-horizon-mini-1198-02-large.webp",
  //       alt: "event horizon MINI 1198 — photo 2",
  //     },
  //     {
  //       src: "/artworks/event-horizon-mini-1198/event-horizon-mini-1198-03-large.webp",
  //       alt: "event horizon MINI 1198 — photo 3",
  //     },
  //     {
  //       src: "/artworks/event-horizon-mini-1198/event-horizon-mini-1198-04-large.webp",
  //       alt: "event horizon MINI 1198 — photo 4",
  //     },
  //     {
  //       src: "/artworks/event-horizon-mini-1198/event-horizon-mini-1198-05-large.webp",
  //       alt: "event horizon MINI 1198 — photo 5",
  //     },
  //     {
  //       src: "/artworks/event-horizon-mini-1198/event-horizon-mini-1198-06-large.webp",
  //       alt: "event horizon MINI 1198 — photo 6",
  //     },
  //     {
  //       src: "/artworks/event-horizon-mini-1198/event-horizon-mini-1198-07-large.webp",
  //       alt: "event horizon MINI 1198 — photo 7",
  //     },
  //     {
  //       src: "/artworks/event-horizon-mini-1198/event-horizon-mini-1198-08-large.webp",
  //       alt: "event horizon MINI 1198 — photo 8",
  //     },
  //     {
  //       src: "/artworks/event-horizon-mini-1198/event-horizon-mini-1198-09-large.webp",
  //       alt: "event horizon MINI 1198 — photo 9",
  //     },
  //     {
  //       src: "/artworks/event-horizon-mini-1198/event-horizon-mini-1198-10-large.webp",
  //       alt: "event horizon MINI 1198 — photo 10",
  //     },
  //   ],
  // },
  {
    id: "event-horizon-ngc1277",
    title: "event horizon NGC1277",
    year: 2026,
    dimensions: "h:32x35x36cm",
    medium: {
      PL: "kamionka toczona na kole garncarskim, szlifowane szkło",
      EN: "wheel-thrown stoneware, polished glass",
      FR: "grès tourné au tour de potier, verre poli",
    },
    prices: { PLN: 5000, EUR: 1150 },

    status: "available",
    description: {
      PL: "",
      EN: "",
      FR: "",
    },
    images: [
      {
        src: "/artworks/event-horizon-ngc1277/event-horizon-ngc1277-01-large.webp",
        alt: "event horizon NGC1277 — photo 1",
      },
      {
        src: "/artworks/event-horizon-ngc1277/event-horizon-ngc1277-02-large.webp",
        alt: "event horizon NGC1277 — photo 2",
      },
      {
        src: "/artworks/event-horizon-ngc1277/event-horizon-ngc1277-03-large.webp",
        alt: "event horizon NGC1277 — photo 3",
      },
      {
        src: "/artworks/event-horizon-ngc1277/event-horizon-ngc1277-04-large.webp",
        alt: "event horizon NGC1277 — photo 4",
      },
      {
        src: "/artworks/event-horizon-ngc1277/event-horizon-ngc1277-05-large.webp",
        alt: "event horizon NGC1277 — photo 5",
      },
      {
        src: "/artworks/event-horizon-ngc1277/event-horizon-ngc1277-06-large.webp",
        alt: "event horizon NGC1277 — photo 6",
      },
      {
        src: "/artworks/event-horizon-ngc1277/event-horizon-ngc1277-07-large.webp",
        alt: "event horizon NGC1277 — photo 7",
      },
      {
        src: "/artworks/event-horizon-ngc1277/event-horizon-ngc1277-08-large.webp",
        alt: "event horizon NGC1277 — photo 8",
      },
      {
        src: "/artworks/event-horizon-ngc1277/event-horizon-ngc1277-09-large.webp",
        alt: "event horizon NGC1277 — photo 9",
      },
      {
        src: "/artworks/event-horizon-ngc1277/event-horizon-ngc1277-10-large.webp",
        alt: "event horizon NGC1277 — photo 10",
      },
      {
        src: "/artworks/event-horizon-ngc1277/event-horizon-ngc1277-11-large.webp",
        alt: "event horizon NGC1277 — photo 11",
      },
      {
        src: "/artworks/event-horizon-ngc1277/event-horizon-ngc1277-12-large.webp",
        alt: "event horizon NGC1277 — photo 12",
      },
      {
        src: "/artworks/event-horizon-ngc1277/event-horizon-ngc1277-13-large.webp",
        alt: "event horizon NGC1277 — photo 13",
      },
      {
        src: "/artworks/event-horizon-ngc1277/event-horizon-ngc1277-14-large.webp",
        alt: "event horizon NGC1277 — photo 14",
      },
      {
        src: "/artworks/event-horizon-ngc1277/event-horizon-ngc1277-15-large.webp",
        alt: "event horizon NGC1277 — photo 15",
      },
      {
        src: "/artworks/event-horizon-ngc1277/event-horizon-ngc1277-16-large.webp",
        alt: "event horizon NGC1277 — photo 16",
      },
      {
        src: "/artworks/event-horizon-ngc1277/event-horizon-ngc1277-17-large.webp",
        alt: "event horizon NGC1277 — photo 17",
      },
      {
        src: "/artworks/event-horizon-ngc1277/event-horizon-ngc1277-18-large.webp",
        alt: "event horizon NGC1277 — photo 18",
      },
      {
        src: "/artworks/event-horizon-ngc1277/event-horizon-ngc1277-19-large.webp",
        alt: "event horizon NGC1277 — photo 19",
      },
      {
        src: "/artworks/event-horizon-ngc1277/event-horizon-ngc1277-20-large.webp",
        alt: "event horizon NGC1277 — photo 20",
      },
      {
        src: "/artworks/event-horizon-ngc1277/event-horizon-ngc1277-21-large.webp",
        alt: "event horizon NGC1277 — photo 21",
      },
      {
        src: "/artworks/event-horizon-ngc1277/event-horizon-ngc1277-22-large.webp",
        alt: "event horizon NGC1277 — photo 22",
      },
      {
        src: "/artworks/event-horizon-ngc1277/event-horizon-ngc1277-23-large.webp",
        alt: "event horizon NGC1277 — photo 23",
      },
      {
        src: "/artworks/event-horizon-ngc1277/event-horizon-ngc1277-24-large.webp",
        alt: "event horizon NGC1277 — photo 24",
      },
    ],
  },
  {
    id: "event-horizon-ngc1600",
    title: "event horizon NGC1600",
    year: 2026,
    dimensions: "h:32x44x44cm",
    medium: {
      PL: "kamionka toczona na kole garncarskim, szlifowane szkło",
      EN: "wheel-thrown stoneware, polished glass",
      FR: "grès tourné au tour de potier, verre poli",
    },
    prices: { PLN: 5000, EUR: 1150 },

    status: "available",
    description: {
      PL: "Opis obrazu",
      EN: "Image description",
      FR: "Description de l'image",
    },
    images: [
      {
        src: "/artworks/event-horizon-ngc1600/event-horizon-ngc1600-01-large.webp",
        alt: "event horizon NGC1600 — photo 1",
      },
      {
        src: "/artworks/event-horizon-ngc1600/event-horizon-ngc1600-02-large.webp",
        alt: "event horizon NGC1600 — photo 2",
      },
      {
        src: "/artworks/event-horizon-ngc1600/event-horizon-ngc1600-03-large.webp",
        alt: "event horizon NGC1600 — photo 3",
      },
      {
        src: "/artworks/event-horizon-ngc1600/event-horizon-ngc1600-04-large.webp",
        alt: "event horizon NGC1600 — photo 4",
      },
      {
        src: "/artworks/event-horizon-ngc1600/event-horizon-ngc1600-05-large.webp",
        alt: "event horizon NGC1600 — photo 5",
      },
      {
        src: "/artworks/event-horizon-ngc1600/event-horizon-ngc1600-06-large.webp",
        alt: "event horizon NGC1600 — photo 6",
      },
    ],
  },
  // {
  //   id: "event-horizon-ngc4889",
  //   title: "event horizon NGC4889",
  //   year: 2026,
  //   dimensions: "h:27x38x38cm",
  //   medium: {
  //     PL: "kamionka toczona na kole garncarskim, szlifowane szkło",
  //     EN: "wheel-thrown stoneware, polished glass",
  //     FR: "grès tourné au tour de potier, verre poli",
  //   },
  //   prices: { PLN: 4000, EUR: 950 },

  //   status: "sold",
  //   description: { PL: "", EN: "", FR: "" },
  //   images: [
  //     {
  //       src: "/artworks/event-horizon-ngc4889/event-horizon-ngc4889-01-large.webp",
  //       alt: "event horizon NGC4889 — photo 1",
  //     },
  //     {
  //       src: "/artworks/event-horizon-ngc4889/event-horizon-ngc4889-02-large.webp",
  //       alt: "event horizon NGC4889 — photo 2",
  //     },
  //     {
  //       src: "/artworks/event-horizon-ngc4889/event-horizon-ngc4889-03-large.webp",
  //       alt: "event horizon NGC4889 — photo 3",
  //     },
  //     {
  //       src: "/artworks/event-horizon-ngc4889/event-horizon-ngc4889-04-large.webp",
  //       alt: "event horizon NGC4889 — photo 4",
  //     },
  //     {
  //       src: "/artworks/event-horizon-ngc4889/event-horizon-ngc4889-05-large.webp",
  //       alt: "event horizon NGC4889 — photo 5",
  //     },
  //   ],
  // },
  {
    id: "event-horizon-ton618",
    title: "event horizon TON618",
    year: 2026,
    dimensions: "h:54x73x73cm",
    medium: {
      PL: "kamionka toczona na kole garncarskim, szlifowane szkło",
      EN: "wheel-thrown stoneware, polished glass",
      FR: "grès tourné au tour de potier, verre poli",
    },
    prices: { PLN: 7800, EUR: 1800 },

    status: "available",
    description: { PL: "", EN: "", FR: "" },
    images: [
      {
        src: "/artworks/event-horizon-ton618/event-horizon-ton618-01-large.webp",
        alt: "event horizon TON618 — photo 1",
      },
      {
        src: "/artworks/event-horizon-ton618/event-horizon-ton618-02-large.webp",
        alt: "event horizon TON618 — photo 2",
      },
      {
        src: "/artworks/event-horizon-ton618/event-horizon-ton618-03-large.webp",
        alt: "event horizon TON618 — photo 3",
      },
      {
        src: "/artworks/event-horizon-ton618/event-horizon-ton618-04-large.webp",
        alt: "event horizon TON618 — photo 4",
      },
      {
        src: "/artworks/event-horizon-ton618/event-horizon-ton618-05-large.webp",
        alt: "event horizon TON618 — photo 5",
      },
      {
        src: "/artworks/event-horizon-ton618/event-horizon-ton618-06-large.webp",
        alt: "event horizon TON618 — photo 6",
      },
    ],
  },
];
