import { customElement } from '@polymer/decorators';
import '@polymer/iron-icon';
import '@polymer/paper-button';
import { html, PolymerElement } from '@polymer/polymer';
import '../utils/icons';
import './shared-styles';

@customElement('call-for-paper-block')
export class CallForPaperBlock extends PolymerElement {
  static get template() {
    return html`
      <style include="shared-styles flex flex-alignment">
        :host {
          display: flex;
          width: 100%;
          background: var(--default-primary-color);
          color: var(--text-primary-color);
          padding: 16px 0;
        }

        paper-button {
          color: #000;
        }

        .action-buttons {
          margin: 0 -8px;
          font-size: 14px;
        }

        .action-buttons paper-button {
          margin: 8px;
        }

        .action-buttons .watch-video {
          color: #fff;
        }

        .action-buttons iron-icon {
          --iron-icon-fill-color: currentColor;
          margin-right: 8px;
        }
      </style>

      <div class="container container-narrow">
        <h1 class="container-title">Call for Paper is open! 🚀</h1>
        <p>
          Our <b>Call for Paper</b> for the 2024 edition is now open! Share your ideas
          with us by submitting a talk. It is time to shine! ✨
        </p>
        <div class="action-buttons" layout horizontal wrap>
          <a href="https://sessionize.com/gdg-devfest-pisa-2024">
            <paper-button primary invert class="icon-right">
              <span class="cta-label">Submit your talk</span>
            </paper-button>
          </a>
        </div>
      </div> 
    `;
  }
}
