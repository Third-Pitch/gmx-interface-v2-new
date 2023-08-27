// date format: d MMM yyyy, H:mm, time should be specifed based on UTC time

export type EventData = {
  id: string;
  title: string;
  isActive?: boolean;
  validTill: string;
  bodyText: string | string[];
  buttons?: {
    text: string;
    link: string;
    newTab?: boolean;
  }[];
};

export const homeEventsData: EventData[] = [
  {
    id: "v2-live",
    title: "EDDX V2 beta is live",
    isActive: true,
    validTill: "9 Sep 2023, 12:00",
    bodyText: "EDDX V2 beta is now available for public use.",
    buttons: [
      {
        text: "Read More",
        link: "https://eddxio.substack.com/p/eddx-v2-beta-is-now-live",
        newTab: true,
      },
      {
        text: "Use V2",
        link: "https://app.eddx.io/#/v2?no_redirect",
      },
    ],
  },
];

export const appEventsData: EventData[] = [
  {
    id: "v2-live",
    title: "EDDX V2 beta is live",
    isActive: true,
    validTill: "9 Sep 2023, 12:00",
    bodyText: "EDDX V2 beta is now available for public use.",
    buttons: [
      {
        text: "Read More",
        link: "https://eddxio.substack.com/p/eddx-v2-beta-is-now-live",
        newTab: true,
      },
      {
        text: "Use V2",
        link: "https://app.eddx.io/#/v2?no_redirect",
      },
    ],
  },
  // {
  //   id: "usdc-to-usdce",
  //   title: "USDC renamed to USDC.e",
  //   isActive: true,
  //   validTill: "9 Jun 2023, 12:00",
  //   bodyText:
  //     "Due to the coming native USDC to Base, the Ethereum-bridged version of USDC is being renamed to USDC.e.",
  //   buttons: [
  //     {
  //       text: "Read More",
  //       link: "https://medium.com/@eddx.io/eddx-deployment-updates-nov-2022-16572314874d",
  //       newTab: true,
  //     },
  //   ],
  // },
];
