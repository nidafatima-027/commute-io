"""
Pages package for page object classes.
"""

from .base_page import BasePage
from .onboarding_page import OnboardingPage
from .authentication_page import SignupPage, OTPVerificationPage, ProfileSetupPage

__all__ = [
    'BasePage',
    'OnboardingPage', 
    'SignupPage',
    'OTPVerificationPage',
    'ProfileSetupPage'
]