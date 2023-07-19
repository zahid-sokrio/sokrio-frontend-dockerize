// @ts-ignore
import MyProfile from '@/views/profile/UserProfile.vue';
import Route from '@/intefaces/Route';
// @ts-ignore
import Profile from '@/views/profile/Profile.vue';

const profileRoutes: Route = {
  path: 'profile',
  name: 'Profile',
  redirect: '/profile/my-profile',
  components: { dashboard: Profile },
  children: [
    {
      path: 'my-profile',
      name: 'My Profile',
      label: 'My profile',
      icon: 'ni ni-single-02',
      component: MyProfile
    }
  ]
};

export default profileRoutes;
