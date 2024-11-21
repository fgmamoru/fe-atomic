import { MainButton } from "@/components/Button/MainButton";
import { MainModal } from "../MainModal";
import { messages } from "@/services/i18n";

export type StakingTermsModalProps = {
    isOpen?: boolean;
    onClose?: () => void;
    onAccept?: () => void;
};

export const StakingTermsModal = (props: StakingTermsModalProps) => {
    return (
        <MainModal
            title="Staking Terms"
            isOpen={props.isOpen}
            onClose={props.onClose}
            footer={<>
                <MainButton
                    onClick={props.onClose}
                    variant="secondary"
                >
                    Cancel
                </MainButton>
                <MainButton

                    onClick={() => {
                        props.onClose?.();
                        props.onAccept?.();
                    }}
                >
                    Accept & Continue
                </MainButton>
            </>}

        >
            <h1>{messages.en.ton} Terms AND CONDITIONS</h1>
            <h2>Lorem ipsum</h2>
            <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed nonne merninisti licere mihi ista probare, quae sunt a te dicta? Duo Reges: constructio interrete. Quae cum dixisset paulumque institisset, Quid est? Quod autem satis est, eo quicquid accessit, nimium est; Quae in controversiam veniunt, de iis, si placet, disseramus
            </p>
            <h2>Lorem ipsum</h2>
            <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed nonne merninisti licere mihi ista probare, quae sunt a te dicta? Duo Reges: constructio interrete. Quae cum dixisset paulumque institisset, Quid est? Quod autem satis est, eo quicquid accessit, nimium est; Quae in controversiam veniunt, de iis, si placet, disseramus
            </p>
            <h2>Lorem ipsum</h2>
            <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed nonne merninisti licere mihi ista probare, quae sunt a te dicta? Duo Reges: constructio interrete. Quae cum dixisset paulumque institisset, Quid est? Quod autem satis est, eo quicquid accessit, nimium est; Quae in controversiam veniunt, de iis, si placet, disseramus
            </p>
            <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed nonne merninisti licere mihi ista probare, quae sunt a te dicta? Duo Reges: constructio interrete. Quae cum dixisset paulumque institisset, Quid est? Quod autem satis est, eo quicquid accessit, nimium est; Quae in controversiam veniunt, de iis, si placet, disseramus
            </p>
            <h2>Lorem ipsum</h2>
            <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed nonne merninisti licere mihi ista probare, quae sunt a te dicta? Duo Reges: constructio interrete. Quae cum dixisset paulumque institisset, Quid est? Quod autem satis est, eo quicquid accessit, nimium est; Quae in controversiam veniunt, de iis, si placet, disseramus
            </p>
            <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed nonne merninisti licere mihi ista probare, quae sunt a te dicta? Duo Reges: constructio interrete. Quae cum dixisset paulumque institisset, Quid est? Quod autem satis est, eo quicquid accessit, nimium est; Quae in controversiam veniunt, de iis, si placet, disseramus
            </p>
            <h2>Lorem ipsum</h2>
            <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed nonne merninisti licere mihi ista probare, quae sunt a te dicta? Duo Reges: constructio interrete. Quae cum dixisset paulumque institisset, Quid est? Quod autem satis est, eo quicquid accessit, nimium est; Quae in controversiam veniunt, de iis, si placet, disseramus
            </p>
        </MainModal>
    )
};