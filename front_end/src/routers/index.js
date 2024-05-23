import { DefaultLayout } from "~/layouts";
import { Select } from '~/components';
import {
  AdmissionManagerLoginPage, AdmissionListPage, AdmissionAcceptedListPage,
  ApplyForAdmissionPage, HomePage, Page500, NotFoundPage, ReportMajor,
  ReportMonth, ReportYears
} from "~/pages";

import { FormLookupAdmissionProfile } from "~/components";

export const public_routers = [
  {
    path: "/",
    element: <HomePage />,
    layout: null,
  },
  {
    path: "/nophosoxettuyen",
    element: <ApplyForAdmissionPage />,
    layout: null,
  },
  {
    path: "/tracuuhoso/:maHoSo",
    element: <FormLookupAdmissionProfile />,
    layout: null,
  },
  {
    path: "/canbots-login",
    element: <AdmissionManagerLoginPage />,
    layout: null,
  },
  {
    path: "/404-NotFound",
    element: <NotFoundPage />,
    layout: null,
  },
  {
    path: "/500-ServerError",
    element: <Page500 />,
    layout: null,
  },
  {
    path: "/select",
    element: <Select />,
    layout: null,
  },
];

export const private_routers = [
  {
    path: "/hosoxettuyen",
    element: <AdmissionListPage />,
    layout: DefaultLayout,
  },
  {
    path: "/hosotrungtuyen",
    element: <AdmissionAcceptedListPage />,
    layout: DefaultLayout,
  },
  {
    path: "/baocaotrungtuyen/nam",
    element: <ReportYears />,
    layout: DefaultLayout,
  },
  {
    path: "/baocaotrungtuyen/thang",
    element: <ReportMonth />,
    layout: DefaultLayout,
  },
  {
    path: "/baocaotrungtuyen/nganh",
    element: <ReportMajor />,
    layout: DefaultLayout,
  }
];
