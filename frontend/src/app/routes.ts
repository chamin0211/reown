import { createBrowserRouter } from 'react-router';
import { MainPage } from './pages/MainPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { CategoryPage } from './pages/CategoryPage';
import { StyleGuidePage } from './pages/StyleGuidePage';
import { TheVaultPage } from './pages/TheVaultPage';
import { WishlistPage } from './pages/WishlistPage';
import { CartPage } from './pages/CartPage';
import { SearchResultsPage } from './pages/SearchResultsPage';
import { LoginPage } from './pages/LoginPage';
import { SignupPage } from './pages/SignupPage';
import { FindAccountPage } from './pages/FindAccountPage';
import { MyBuyingPage } from './pages/MyBuyingPage';
import { MySellingPage } from './pages/MySellingPage';
import { MyBiddingPage } from './pages/MyBiddingPage';
import { SettingsPage } from './pages/SettingsPage';
import { SupportPage } from './pages/SupportPage';
import { InquiryFormPage } from './pages/InquiryFormPage';
import { CategoryDetailPage } from './pages/CategoryDetailPage';
import { FAQDetailPage } from './pages/FAQDetailPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { FundingCheckoutPage } from './pages/FundingCheckoutPage';
import { ErrorPage } from './pages/ErrorPage';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: MainPage,
    ErrorBoundary: ErrorPage,
  },
  {
    path: '/product/:productId',
    Component: ProductDetailPage,
    ErrorBoundary: ErrorPage,
  },
  {
    path: '/category/:category',
    Component: CategoryPage,
    ErrorBoundary: ErrorPage,
  },
  {
    path: '/style-guide',
    Component: StyleGuidePage,
    ErrorBoundary: ErrorPage,
  },
  {
    path: '/vault',
    Component: TheVaultPage,
    ErrorBoundary: ErrorPage,
  },
  {
    path: '/wishlist',
    Component: WishlistPage,
    ErrorBoundary: ErrorPage,
  },
  {
    path: '/cart',
    Component: CartPage,
    ErrorBoundary: ErrorPage,
  },
  {
    path: '/search',
    Component: SearchResultsPage,
    ErrorBoundary: ErrorPage,
  },
  {
    path: '/login',
    Component: LoginPage,
    ErrorBoundary: ErrorPage,
  },
  {
    path: '/signup',
    Component: SignupPage,
    ErrorBoundary: ErrorPage,
  },
  {
    path: '/find-account',
    Component: FindAccountPage,
    ErrorBoundary: ErrorPage,
  },
  {
    path: '/my/buying',
    Component: MyBuyingPage,
    ErrorBoundary: ErrorPage,
  },
  {
    path: '/my/selling',
    Component: MySellingPage,
    ErrorBoundary: ErrorPage,
  },
  {
    path: '/my/bidding',
    Component: MyBiddingPage,
    ErrorBoundary: ErrorPage,
  },
  {
    path: '/settings',
    Component: SettingsPage,
    ErrorBoundary: ErrorPage,
  },
  {
    path: '/support',
    Component: SupportPage,
    ErrorBoundary: ErrorPage,
  },
  {
    path: '/support/inquiry',
    Component: InquiryFormPage,
    ErrorBoundary: ErrorPage,
  },
  {
    path: '/support/category/:category',
    Component: CategoryDetailPage,
    ErrorBoundary: ErrorPage,
  },
  {
    path: '/support/faq/:faqId',
    Component: FAQDetailPage,
    ErrorBoundary: ErrorPage,
  },
  {
    path: '/checkout',
    Component: CheckoutPage,
    ErrorBoundary: ErrorPage,
  },
  {
    path: '/funding-checkout',
    Component: FundingCheckoutPage,
    ErrorBoundary: ErrorPage,
  },
]);