import Home from "./Line icons/General/home-03.svg";
import Compass from "./Line icons/Maps & travel/compass-03.svg";
import Plus from "./Line icons/General/plus.svg";
import Search from "./Line icons/General/search-sm.svg";
import Profile from "./Line icons/Users/user-circle.svg";
import Download from "./Line icons/Arrows/arrow-down.svg";
import More from "./Line icons/General/dots-vertical.svg";
import Comment from "./Line icons/Communication/message-square-02.svg";
import Bell from "./Line icons/Alerts & feedback/bell-02.svg";
import Zap from "./Line icons/General/zap.svg";
import Collection from "./collection.svg";
import Repost from "./repost.svg";
import Shaka from "./shaka.svg";
import Verified from "./verified.svg";

export default function StemstrIcon({ children }) {
  return children;
}

export const HomeIcon = (props) => {
  return (
    <StemstrIcon>
      <Home {...props} />
    </StemstrIcon>
  );
};

export const CompassIcon = (props) => {
  return (
    <StemstrIcon>
      <Compass {...props} />
    </StemstrIcon>
  );
};

export const PlusIcon = (props) => {
  return (
    <StemstrIcon>
      <Plus {...props} />
    </StemstrIcon>
  );
};

export const ProfileIcon = (props) => {
  return (
    <StemstrIcon>
      <Profile {...props} />
    </StemstrIcon>
  );
};

export const DownloadIcon = (props) => {
  return (
    <StemstrIcon>
      <Download {...props} />
    </StemstrIcon>
  );
};

export const MoreIcon = (props) => {
  return (
    <StemstrIcon>
      <More {...props} />
    </StemstrIcon>
  );
};

export const CommentIcon = (props) => {
  return (
    <StemstrIcon>
      <Comment {...props} />
    </StemstrIcon>
  );
};

export const ZapIcon = (props) => {
  return (
    <StemstrIcon>
      <Zap {...props} />
    </StemstrIcon>
  );
};

export const CollectionIcon = (props) => {
  return (
    <StemstrIcon>
      <Collection {...props} />
    </StemstrIcon>
  );
};

export const RepostIcon = (props) => {
  return (
    <StemstrIcon>
      <Repost {...props} />
    </StemstrIcon>
  );
};

export const ShakaIcon = (props) => {
  return (
    <StemstrIcon>
      <Shaka {...props} />
    </StemstrIcon>
  );
};

export const BellIcon = (props) => {
  return (
    <StemstrIcon>
      <Bell {...props} />
    </StemstrIcon>
  );
};

export const SearchIcon = (props) => {
  return (
    <StemstrIcon>
      <Search {...props} />
    </StemstrIcon>
  );
};

export const VerifiedIcon = (props) => {
  return (
    <StemstrIcon>
      <Verified {...props} />
    </StemstrIcon>
  );
};
