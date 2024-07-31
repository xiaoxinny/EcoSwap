import React from "react";
import {
  Box,
  Link,
  Typography,
  IconButton,
  SvgIcon
} from "@mui/material";
import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";
import InstagramIcon from "@mui/icons-material/Instagram";
import LinkedInIcon from "@mui/icons-material/LinkedIn";

function Footer() {
  return (
    <Box sx={{ py: 6, textAlign: "center", backgroundColor:"darkgrey" }}>
      <Link href="#" underline="none" color="inherit">
        <img src="nereus-assets/img/nereus-light.png" alt="" width="110" />
      </Link>
      <Box sx={{ display: "flex", flexWrap: "wrap", justifyContent: "center", mt: 4, mb: 1 }}>
        <Link href="#" underline="hover" color="white" sx={{ mx: 3, mb: 2 }}>
          Listings
        </Link>
        <Link href="#" underline="hover" color="white" sx={{ mx: 3, mb: 2 }}>
          About
        </Link>
        <Link href="#" underline="hover" color="white" sx={{ mx: 3, mb: 2 }}>
          Events
        </Link>
        <Link href="#" underline="hover" color="white" sx={{ mx: 3, mb: 2 }}>
          Support
        </Link>
      </Box>
      <Box sx={{ mb: 3 }}>
        <IconButton aria-label="Facebook" color="inherit">
          <SvgIcon component={FacebookIcon} />
        </IconButton>
        <IconButton aria-label="Twitter" color="inherit">
          <SvgIcon component={TwitterIcon} />
        </IconButton>
        <IconButton aria-label="Instagram" color="inherit">
          <SvgIcon component={InstagramIcon} />
        </IconButton>
        <IconButton aria-label="LinkedIn" color="inherit">
          <SvgIcon component={LinkedInIcon} />
        </IconButton>
      </Box>
      <Typography variant="caption" color="textSecondary">
        © 2024 EcoWorld. All rights reserved.
      </Typography>
    </Box>
  );
}

export default Footer;