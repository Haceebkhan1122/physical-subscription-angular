import { LoginComponent } from './login/login.component';
import { SubscriptionsComponent } from './subscriptions/subscriptions.component';
import { SubscriptionListComponent } from './subscription-list/subscription-list.component';
import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { SubscriptionEnabledComponent } from './subscription-enabled/subscription-enabled.component';
import { CorporateSubscriptionComponent } from './corporate-subscription/corporate-subscription.component';

export const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'login', component: LoginComponent },
  { path: 'subscription', component: SubscriptionsComponent },
  { path: 'subscription-list', component: SubscriptionListComponent },
  { path: 'subscription-enabled', component: SubscriptionEnabledComponent },
  { path: 'corporate-subscription', component: CorporateSubscriptionComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { } 
