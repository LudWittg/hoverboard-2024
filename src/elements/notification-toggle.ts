import { Success } from '@abraham/remotedata';
import '@material/mwc-formfield';
import '@material/mwc-switch';
import { Switch } from '@material/mwc-switch';
import { computed, customElement, property } from '@polymer/decorators';
import { html, PolymerElement } from '@polymer/polymer';
import '../components/auth-required';
import { ReduxMixin } from '../mixins/redux-mixin';
import { RootState, store } from '../store';
import {
  initialNotificationPermissionState,
  PROMPT_USER,
  requestNotificationPermission,
  unsupportedNotificationPermission,
} from '../store/notification-permission';
import { selectNotificationsSubscribers } from '../store/notifications-subscribers/selectors';
import { initialNotificationsSubscribersState } from '../store/notifications-subscribers/state';
import { selectNotificationsUsersSubscribed } from '../store/notifications-users/selectors';
import {
  clearNotificationsSubscribers,
  updateNotificationsSubscribers,
} from '../store/update-notifications-subscribers/actions';
import { initialUpdateNotificationsSubscribersState } from '../store/update-notifications-subscribers/state';
import {
  removeNotificationsUsers,
  updateNotificationsUsers,
} from '../store/update-notifications-users/actions';
import { initialUserState } from '../store/user/state';
import './shared-styles';

@customElement('notification-toggle')
export class NotificationToggle extends ReduxMixin(PolymerElement) {
  static get template() {
    return html`
      <style include="shared-styles flex flex-alignment positioning">
        .dropdown-panel {
          padding: 24px;
          max-width: 300px;
          background: #fff;
          font-size: 16px;
          color: var(--primary-text-color);
        }

        .dropdown-panel p {
          margin-top: 0;
        }

        .dropdown-panel .panel-actions {
          margin: 0 -16px -16px 0;
        }

        mwc-formfield,
        auth-required {
          margin: 12px 0;
        }
      </style>

      <paper-menu-button
        id="notificationsMenu"
        class="notifications-menu"
        vertical-align="top"
        horizontal-align="right"
        no-animations
        opened="{{opened}}"
        on-click="requestPermission"
      >
        <paper-icon-button icon="hoverboard:[[icon]]" slot="dropdown-trigger"></paper-icon-button>

        <div class="dropdown-panel" slot="dropdown-content">
          <template is="dom-if" if="[[initialized]]">
            <p>{$ notifications.default $}</p>
            <div class="panel-actions" layout horizontal end-justified>
              <paper-button primary-text on-click="requestPermission">
                {$ notifications.enable $}
              </paper-button>
            </div>
          </template>

          <template is="dom-if" if="[[pending]]">Loading...</template>

          <template is="dom-if" if="[[success]]">
            <p>{$ notifications.enabled $}</p>
            <mwc-formfield label="General notifications">
              <mwc-switch
                on-click="toggleGeneralNotifications"
                selected="[[notificationsSubscribers.data]]"
              ></mwc-switch>
            </mwc-formfield>

            <auth-required>
              <p slot="prompt">Sign in to get personalized session notifications.</p>
              <mwc-formfield label="My Schedule notifications">
                <mwc-switch
                  on-click="toggleMyScheduleNotifications"
                  selected="[[notificationsUsersSubscribed]]"
                ></mwc-switch>
              </mwc-formfield>
            </auth-required>
          </template>

          <template is="dom-if" if="[[blocked]]">
            <p>{$ notifications.blocked.text $}</p>
            <div class="panel-actions" layout horizontal end-justified>
              <a href="{$ notifications.blocked.link $}" target="_blank" rel="noopener noreferrer">
                <paper-button primary-text on-click="close">
                  {$ notifications.blocked.label $}
                </paper-button>
              </a>
            </div>
          </template>

          <template is="dom-if" if="[[unsupported]]">
            <p>{$ notifications.unsupported.text $}</p>
            <div class="panel-actions" layout horizontal end-justified>
              <a
                href="{$ notifications.unsupported.link $}"
                target="_blank"
                rel="noopener noreferrer"
              >
                <paper-button primary-text on-click="close">
                  {$ notifications.unsupported.label $}
                </paper-button>
              </a>
            </div>
          </template>

          <template is="dom-if" if="[[failure]]">
            <p>{$ notifications.unknown.text $}</p>
          </template>
        </div>
      </paper-menu-button>
    `;
  }

  @property({ type: Object })
  notificationPermission = initialNotificationPermissionState;
  @property({ type: Object })
  updateNotificationsSubscribers = initialUpdateNotificationsSubscribersState;
  @property({ type: Object })
  notificationsSubscribers = initialNotificationsSubscribersState;
  @property({ type: Boolean })
  notificationsUsersSubscribed = false;
  @property({ type: Object })
  user = initialUserState;

  @property({ type: Boolean })
  private opened = false;

  override connectedCallback() {
    super.connectedCallback();

    if ('Notification' in window && 'permissions' in navigator) {
      navigator.permissions.query({ name: 'notifications' }).then((permission) => {
        store.dispatch(requestNotificationPermission(PROMPT_USER.NO));
        permission.onchange = () => {
          store.dispatch(requestNotificationPermission(PROMPT_USER.NO));
        };
      });
    } else {
      store.dispatch(unsupportedNotificationPermission());
    }
  }

  override stateChanged(state: RootState) {
    this.notificationPermission = state.notificationPermission;
    this.user = state.user;
    this.notificationsSubscribers = selectNotificationsSubscribers(state);
    this.notificationsUsersSubscribed = selectNotificationsUsersSubscribed(state);
    this.updateNotificationsSubscribers = state.updateNotificationsSubscribers;
  }

  @computed('notificationPermission')
  get initialized() {
    return (
      this.notificationPermission.kind === 'initialized' ||
      this.notificationPermission.kind === 'pending'
    );
  }

  @computed('notificationPermission')
  get blocked() {
    return (
      this.notificationPermission.kind === 'failure' &&
      this.notificationPermission.error.message === 'denied'
    );
  }

  @computed('notificationPermission')
  get unsupported() {
    return (
      this.notificationPermission.kind === 'failure' &&
      this.notificationPermission.error.message === 'unsupported'
    );
  }

  @computed('notificationPermission')
  get failure() {
    return (
      this.notificationPermission.kind === 'failure' &&
      this.notificationPermission.error.message !== 'denied' &&
      this.notificationPermission.error.message !== 'unsupported'
    );
  }

  @computed('notificationPermission')
  get success() {
    return this.notificationPermission.kind === 'success';
  }

  private requestPermission() {
    if (this.notificationPermission.kind === 'initialized') {
      store.dispatch(requestNotificationPermission(PROMPT_USER.YES));
    }
  }

  private toggleGeneralNotifications(event: MouseEvent) {
    const { selected, disabled } = event.target as Switch;
    if (this.notificationPermission.kind !== 'success' || disabled) {
      return;
    }

    if (selected) {
      store.dispatch(updateNotificationsSubscribers(this.notificationPermission.data));
    } else {
      store.dispatch(clearNotificationsSubscribers(this.notificationPermission.data));
    }
  }

  private toggleMyScheduleNotifications(event: MouseEvent) {
    const { selected } = event.target as Switch;
    if (this.notificationPermission.kind !== 'success' || !(this.user instanceof Success)) {
      return;
    }

    if (selected) {
      store.dispatch(
        updateNotificationsUsers(this.user.data.uid, this.notificationPermission.data)
      );
    } else {
      store.dispatch(
        removeNotificationsUsers(this.user.data.uid, this.notificationPermission.data)
      );
    }
  }

  @computed('notificationPermission')
  get icon() {
    if (this.notificationPermission.kind === 'success') {
      return 'bell';
    } else if (this.notificationPermission.kind === 'failure') {
      return 'bell-off';
    } else {
      return 'bell-outline';
    }
  }

  private close() {
    this.opened = false;
  }
}
