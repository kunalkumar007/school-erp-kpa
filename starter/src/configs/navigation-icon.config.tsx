import {
    PiHouseLineDuotone,
    PiArrowsInDuotone,
    PiBookOpenUserDuotone,
    PiBookBookmarkDuotone,
    PiAcornDuotone,
    PiBagSimpleDuotone,
    PiBuildingsDuotone,
    PiTargetDuotone,
    PiClipboardTextDuotone,
    PiClockCountdownDuotone,
    PiReceiptDuotone,
} from 'react-icons/pi'
import type { JSX } from 'react'

export type NavigationIcons = Record<string, JSX.Element>

const navigationIcon: NavigationIcons = {
    home: <PiHouseLineDuotone />,
    singleMenu: <PiAcornDuotone />,
    collapseMenu: <PiArrowsInDuotone />,
    groupSingleMenu: <PiBookOpenUserDuotone />,
    groupCollapseMenu: <PiBookBookmarkDuotone />,
    groupMenu: <PiBagSimpleDuotone />,
    departments: <PiBuildingsDuotone />,
    kras: <PiTargetDuotone />,
    selfTasks: <PiClipboardTextDuotone />,
    hodDashboard: <PiClockCountdownDuotone />,
    purchases: <PiReceiptDuotone />,
}

export default navigationIcon
