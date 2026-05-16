import { createBrowserRouter } from 'react-router';
import { RoleAwareHomePage } from './pages/RoleAwareHomePage';
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
import { FundingDetailPage } from './pages/FundingDetailPage';
import { MyFundingPage } from './pages/MyFundingPage';
import { ErrorPage } from './pages/ErrorPage';
import { ResellMarketPage } from './pages/ResellMarketPage';
import { ResellDetailPage } from './pages/ResellDetailPage';
import { ResellRegisterPage } from './pages/ResellRegisterPage';
import { OrderDetailPage } from './pages/OrderDetailPage';
import { KakaoCallbackPage } from './pages/KakaoCallbackPage';

import { AuthProvider as SellerAuthProvider } from './seller/contexts/AuthContext';
import { Layout as SellerLayout } from './seller/components/Layout';
import { ProtectedRoute as SellerProtectedRoute } from './seller/components/ProtectedRoute';
import { Dashboard as SellerDashboard } from './seller/pages/Dashboard';
import { RegularProductForm as SellerRegularProductForm } from './seller/pages/RegularProductForm';
import { LimitedEditionForm as SellerLimitedEditionForm } from './seller/pages/LimitedEditionForm';
import { ProductManagement as SellerProductManagement } from './seller/pages/ProductManagement';
import { OrderManagement as SellerOrderManagement } from './seller/pages/OrderManagement';
import { LimitedEditionManagement as SellerLimitedEditionManagement } from './seller/pages/LimitedEditionManagement';
import { Settlement as SellerSettlement } from './seller/pages/Settlement';
import { BrandProfile as SellerBrandProfile } from './seller/pages/BrandProfile';
import { FundingCampaign as SellerFundingCampaign } from './seller/pages/FundingCampaign';
import { FundingProjectForm as SellerFundingProjectForm } from './seller/pages/FundingProjectForm';
import { ResellManagement as SellerResellManagement } from './seller/pages/ResellManagement';
import { ResellSalesManagement as SellerResellSalesManagement } from './seller/pages/ResellSalesManagement';
import { Dashboard as AdminDashboard } from './admin/components/Dashboard';
import { ProductManagementPage as AdminProductManagementPage } from './admin/components/ProductManagementPage';
import { ProductReviewDetailPage as AdminProductReviewDetailPage } from './admin/components/ProductReviewDetailPage';
import { SettlementManagementPage as AdminSettlementManagementPage } from './admin/components/SettlementManagementPage';
import { SettlementPayoutPage as AdminSettlementPayoutPage } from './admin/components/SettlementPayoutPage';
import { RevenueAnalyticsPage as AdminRevenueAnalyticsPage } from './admin/components/RevenueAnalyticsPage';
import { FundingManagementPage as AdminFundingManagementPage } from './admin/components/FundingManagementPage';
import { ResellInspectionQueuePage as AdminResellInspectionQueuePage } from './admin/components/ResellInspectionQueuePage';
import { RoleProtectedRoute } from './components/RoleProtectedRoute';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: RoleAwareHomePage,
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
  {
    path: '/funding/:campaignId',
    Component: FundingDetailPage,
    ErrorBoundary: ErrorPage,
  },
  {
    path: '/my/funding',
    Component: MyFundingPage,
    ErrorBoundary: ErrorPage,
  },
  {
    path: '/resell',
    Component: ResellMarketPage,
    ErrorBoundary: ErrorPage,
  },
  {
    path: '/resell/new',
    Component: ResellRegisterPage,
    ErrorBoundary: ErrorPage,
  },
  {
    path: '/resell/:resellId',
    Component: ResellDetailPage,
    ErrorBoundary: ErrorPage,
  },

  {
    path: '/oauth/kakao/callback',
    Component: KakaoCallbackPage,
    ErrorBoundary: ErrorPage,
  },
  {
    path: '/orders/:orderId',
    Component: OrderDetailPage,
    ErrorBoundary: ErrorPage,
  },

  {
    path: '/seller',
    element: (
      <RoleProtectedRoute allowedRoles={['SELLER']}>
        <SellerAuthProvider>
          <SellerLayout />
        </SellerAuthProvider>
      </RoleProtectedRoute>
    ),
    ErrorBoundary: ErrorPage,
    children: [
      { index: true, Component: SellerDashboard },
      {
        path: 'product/add',
        element: (
          <SellerProtectedRoute allowedRoles={["BRAND_SELLER", "DESIGNER"]}>
            <SellerRegularProductForm />
          </SellerProtectedRoute>
        ),
      },
      {
        path: 'limited-edition/new',
        element: (
          <SellerProtectedRoute allowedRoles={["DESIGNER"]}>
            <SellerLimitedEditionForm />
          </SellerProtectedRoute>
        ),
      },
      { path: 'products', Component: SellerProductManagement },
      { path: 'orders', Component: SellerOrderManagement },
      { path: 'limited-editions', Component: SellerLimitedEditionManagement },
      { path: 'settlement', Component: SellerSettlement },
      { path: 'funding', Component: SellerFundingCampaign },
      { path: 'funding/new', Component: SellerFundingProjectForm },
      { path: 'resell', Component: SellerResellManagement },
      { path: 'resell-sales', Component: SellerResellSalesManagement },
      { path: 'profile', Component: SellerBrandProfile },
    ],
  },
  {
    path: '/admin',
    element: (
      <RoleProtectedRoute allowedRoles={['ADMIN']}>
        <AdminDashboard />
      </RoleProtectedRoute>
    ),
    ErrorBoundary: ErrorPage,
  },
  {
    path: '/admin/products',
    element: (
      <RoleProtectedRoute allowedRoles={['ADMIN']}>
        <AdminProductManagementPage />
      </RoleProtectedRoute>
    ),
    ErrorBoundary: ErrorPage,
  },
  {
    path: '/admin/funding',
    element: (
      <RoleProtectedRoute allowedRoles={['ADMIN']}>
        <AdminFundingManagementPage />
      </RoleProtectedRoute>
    ),
    ErrorBoundary: ErrorPage,
  },

  {
    path: '/admin/resell',
    element: (
      <RoleProtectedRoute allowedRoles={['ADMIN']}>
        <AdminResellInspectionQueuePage />
      </RoleProtectedRoute>
    ),
    ErrorBoundary: ErrorPage,
  },

  {
    path: '/admin/settlement',
    element: (
      <RoleProtectedRoute allowedRoles={['ADMIN']}>
        <AdminSettlementManagementPage />
      </RoleProtectedRoute>
    ),
    ErrorBoundary: ErrorPage,
  },
  {
    path: '/admin/settlement/payout',
    element: (
      <RoleProtectedRoute allowedRoles={['ADMIN']}>
        <AdminSettlementPayoutPage />
      </RoleProtectedRoute>
    ),
    ErrorBoundary: ErrorPage,
  },
  {
    path: '/admin/settlement/analytics',
    element: (
      <RoleProtectedRoute allowedRoles={['ADMIN']}>
        <AdminRevenueAnalyticsPage />
      </RoleProtectedRoute>
    ),
    ErrorBoundary: ErrorPage,
  },

  {
    path: '/admin/product-review/:id',
    element: (
      <RoleProtectedRoute allowedRoles={['ADMIN']}>
        <AdminProductReviewDetailPage />
      </RoleProtectedRoute>
    ),
    ErrorBoundary: ErrorPage,
  },
]);